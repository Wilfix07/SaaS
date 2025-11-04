'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import { FrameToolbar } from './FrameToolbar';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface FrameRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FrameProps {
  id: string;
  initialRect: FrameRect;
  minSize?: { width: number; height: number };
  maxSize?: { width: number; height: number };
  onChange?: (rect: FrameRect) => void;
  onClose?: () => void;
  onCollapse?: (collapsed: boolean) => void;
  children: React.ReactNode;
  title?: string;
  defaultSize?: FrameRect;
  snapToGrid?: boolean;
  gridSize?: number;
  className?: string;
  'aria-label'?: string;
}

const DEFAULT_MIN_SIZE = { width: 200, height: 150 };
const DEFAULT_GRID_SIZE = 8;

export function Frame({
  id,
  initialRect,
  minSize = DEFAULT_MIN_SIZE,
  maxSize,
  onChange,
  onClose,
  onCollapse,
  children,
  title,
  defaultSize,
  snapToGrid = false,
  gridSize = DEFAULT_GRID_SIZE,
  className,
  'aria-label': ariaLabel,
}: FrameProps) {
  const [rect, setRect] = useState<FrameRect>(initialRect);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [announcement, setAnnouncement] = useState<string>('');
  const frameRef = useRef<HTMLDivElement>(null);
  const resizeTimeoutRef = useRef<NodeJS.Timeout>();

  // Snap value to grid
  const snap = useCallback(
    (value: number) => {
      if (!snapToGrid) return value;
      return Math.round(value / gridSize) * gridSize;
    },
    [snapToGrid, gridSize]
  );

  // Handle resize
  const handleResize = useCallback(
    (_e: any, _direction: any, ref: HTMLElement, _delta: any, position: { x: number; y: number }) => {
      const newRect: FrameRect = {
        x: snap(position.x),
        y: snap(position.y),
        width: snap(parseInt(ref.style.width)),
        height: snap(parseInt(ref.style.height)),
      };

      setRect(newRect);
      setIsResizing(true);

      // Debounce onChange callback
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      resizeTimeoutRef.current = setTimeout(() => {
        onChange?.(newRect);
        setIsResizing(false);
        const sizeAnnouncement = `Frame resized to ${Math.round(newRect.width)} by ${Math.round(newRect.height)} pixels`;
        setAnnouncement(sizeAnnouncement);
      }, 50);
    },
    [onChange, snap]
  );

  // Handle drag
  const handleDrag = useCallback(
    (_e: any, d: { x: number; y: number }) => {
      const newRect: FrameRect = {
        ...rect,
        x: snap(d.x),
        y: snap(d.y),
      };
      setRect(newRect);
      setIsDragging(true);
    },
    [rect, snap]
  );

  const handleDragStop = useCallback(
    (_e: any, d: { x: number; y: number }) => {
      const newRect: FrameRect = {
        ...rect,
        x: snap(d.x),
        y: snap(d.y),
      };
      setRect(newRect);
      setIsDragging(false);
      onChange?.(newRect);
      const positionAnnouncement = `Frame moved to position ${Math.round(newRect.x)}, ${Math.round(newRect.y)}`;
      setAnnouncement(positionAnnouncement);
    },
    [rect, onChange, snap]
  );

  // Handle collapse
  const handleCollapse = useCallback(() => {
    const newCollapsed = !isCollapsed;
    setIsCollapsed(newCollapsed);
    onCollapse?.(newCollapsed);
    setAnnouncement(newCollapsed ? 'Frame collapsed' : 'Frame expanded');
  }, [isCollapsed, onCollapse]);

  // Handle close
  const handleClose = useCallback(() => {
    onClose?.();
    setAnnouncement('Frame closed');
  }, [onClose]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const frameElement = frameRef.current;
      if (!frameElement || (document.activeElement !== frameElement && !frameElement.contains(document.activeElement))) {
        return;
      }

      const step = e.shiftKey ? 20 : 5;
      let newRect = { ...rect };
      let moved = false;

      switch (e.key) {
        case 'ArrowUp':
          e.preventDefault();
          newRect.y = Math.max(0, snap(rect.y - step));
          moved = true;
          break;
        case 'ArrowDown':
          e.preventDefault();
          newRect.y = snap(rect.y + step);
          moved = true;
          break;
        case 'ArrowLeft':
          e.preventDefault();
          newRect.x = Math.max(0, snap(rect.x - step));
          moved = true;
          break;
        case 'ArrowRight':
          e.preventDefault();
          newRect.x = snap(rect.x + step);
          moved = true;
          break;
        case 'Escape':
          if (isResizing || isDragging) {
            e.preventDefault();
            setRect(initialRect);
            setIsResizing(false);
            setIsDragging(false);
            setAnnouncement('Resize or drag cancelled');
          }
          break;
      }

      if (moved) {
        setRect(newRect);
        onChange?.(newRect);
        const positionAnnouncement = `Frame moved to position ${Math.round(newRect.x)}, ${Math.round(newRect.y)}`;
        setAnnouncement(positionAnnouncement);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [rect, initialRect, isResizing, isDragging, onChange, snap]);

  // Handle double-click on border
  const handleBorderDoubleClick = useCallback(() => {
    if (defaultSize && (rect.width !== defaultSize.width || rect.height !== defaultSize.height)) {
      const newRect = { ...rect, ...defaultSize };
      setRect(newRect);
      onChange?.(newRect);
      setAnnouncement(`Frame resized to default size: ${Math.round(defaultSize.width)} by ${Math.round(defaultSize.height)} pixels`);
    }
  }, [rect, defaultSize, onChange]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, []);

  const frameId = `frame-${id}`;
  const displayTitle = title || `Frame ${id}`;

  return (
    <>
      {/* ARIA Live Region for announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        aria-label="Frame status updates"
      >
        {announcement}
      </div>

      <Rnd
        size={{
          width: isCollapsed ? rect.width : rect.width,
          height: isCollapsed ? 50 : rect.height,
        }}
        position={{ x: rect.x, y: rect.y }}
        minWidth={minSize.width}
        minHeight={isCollapsed ? 50 : minSize.height}
        maxWidth={maxSize?.width}
        maxHeight={isCollapsed ? 50 : maxSize?.height}
        onResize={handleResize}
        onDrag={handleDrag}
        onDragStop={handleDragStop}
        bounds="parent"
        style={{
          zIndex: isDragging || isResizing ? 1000 : 'auto',
        }}
        className={cn(
          'frame-container',
          isDragging || isResizing ? 'shadow-2xl' : 'shadow-lg',
          'transition-shadow duration-200',
          className
        )}
        enableResizing={{
          top: !isCollapsed,
          right: !isCollapsed,
          bottom: !isCollapsed,
          left: !isCollapsed,
          topRight: !isCollapsed,
          bottomRight: !isCollapsed,
          bottomLeft: !isCollapsed,
          topLeft: !isCollapsed,
        }}
        resizeHandleStyles={{
          top: { cursor: 'n-resize', height: '8px' },
          right: { cursor: 'e-resize', width: '8px' },
          bottom: { cursor: 's-resize', height: '8px' },
          left: { cursor: 'w-resize', width: '8px' },
          topRight: { cursor: 'ne-resize', width: '12px', height: '12px' },
          bottomRight: { cursor: 'se-resize', width: '12px', height: '12px' },
          bottomLeft: { cursor: 'sw-resize', width: '12px', height: '12px' },
          topLeft: { cursor: 'nw-resize', width: '12px', height: '12px' },
        }}
        resizeHandleClasses={{
          top: 'frame-resize-handle top-0',
          right: 'frame-resize-handle right-0',
          bottom: 'frame-resize-handle bottom-0',
          left: 'frame-resize-handle left-0',
          topRight: 'frame-resize-handle top-0 right-0',
          bottomRight: 'frame-resize-handle bottom-0 right-0',
          bottomLeft: 'frame-resize-handle bottom-0 left-0',
          topLeft: 'frame-resize-handle top-0 left-0',
        }}
      >
        <motion.div
          ref={frameRef}
          id={frameId}
          role="region"
          aria-label={ariaLabel || displayTitle}
          aria-expanded={!isCollapsed}
          tabIndex={0}
          className={cn(
            'h-full w-full bg-card border-2 border-border rounded-lg overflow-hidden',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
            'flex flex-col'
          )}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          onDoubleClick={handleBorderDoubleClick}
        >
          {/* Frame Toolbar */}
          <div className="flex-shrink-0 border-b border-border bg-muted/50">
            <FrameToolbar
              title={displayTitle}
              isCollapsed={isCollapsed}
              onCollapse={handleCollapse}
              onClose={handleClose}
              frameId={frameId}
            />
          </div>

          {/* Frame Content */}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                className="flex-1 overflow-auto p-4"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {children}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </Rnd>

      <style jsx global>{`
        .frame-container {
          position: relative;
        }

        .frame-resize-handle {
          background: transparent;
          transition: background-color 0.2s;
        }

        .frame-resize-handle:hover {
          background: rgba(var(--primary) / 0.2);
        }

        .frame-container:hover .frame-resize-handle {
          background: rgba(var(--primary) / 0.1);
        }

        .frame-container:hover .frame-resize-handle:hover {
          background: rgba(var(--primary) / 0.3);
        }
      `}</style>
    </>
  );
}
