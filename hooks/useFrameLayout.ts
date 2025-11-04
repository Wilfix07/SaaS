'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { FrameRect } from '@/components/frames/Frame';

export interface FrameLayout {
  [frameId: string]: FrameRect;
}

const DEBOUNCE_DELAY = 700;

export function useFrameLayout(layoutName: string = 'default') {
  const [layouts, setLayouts] = useState<FrameLayout>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  // Load layout from backend
  useEffect(() => {
    async function loadLayout() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setIsLoading(false);
          return;
        }

        const response = await fetch(
          `/api/saveLayout?layoutName=${encodeURIComponent(layoutName)}`
        );

        if (!response.ok) {
          throw new Error('Failed to load layout');
        }

        const result = await response.json();
        if (result.layout?.layout_data) {
          setLayouts(result.layout.layout_data as FrameLayout);
        }
      } catch (error) {
        console.error('Failed to load layout:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadLayout();
  }, [layoutName]);

  // Save layout to backend (debounced)
  const saveLayout = useCallback(
    async (newLayouts: FrameLayout) => {
      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Set new timeout
      saveTimeoutRef.current = setTimeout(async () => {
        try {
          setIsSaving(true);
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) {
            return;
          }

          const response = await fetch('/api/saveLayout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              layoutData: newLayouts,
              layoutName,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to save layout');
          }
        } catch (error) {
          console.error('Failed to save layout:', error);
        } finally {
          setIsSaving(false);
        }
      }, DEBOUNCE_DELAY);
    },
    [layoutName]
  );

  // Update frame position/size
  const updateFrame = useCallback(
    (frameId: string, rect: FrameRect) => {
      const newLayouts = {
        ...layouts,
        [frameId]: rect,
      };
      setLayouts(newLayouts);
      saveLayout(newLayouts);
    },
    [layouts, saveLayout]
  );

  // Remove frame from layout
  const removeFrame = useCallback(
    (frameId: string) => {
      const newLayouts = { ...layouts };
      delete newLayouts[frameId];
      setLayouts(newLayouts);
      saveLayout(newLayouts);
    },
    [layouts, saveLayout]
  );

  // Clear all layouts
  const clearLayout = useCallback(async () => {
    setLayouts({});
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return;
      }

      await fetch(
        `/api/saveLayout?layoutName=${encodeURIComponent(layoutName)}`,
        {
          method: 'DELETE',
        }
      );
    } catch (error) {
      console.error('Failed to clear layout:', error);
    }
  }, [layoutName]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    layouts,
    isLoading,
    isSaving,
    updateFrame,
    removeFrame,
    clearLayout,
  };
}
