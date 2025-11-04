'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Minimize2, Maximize2, X, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FrameToolbarProps {
  title: string;
  isCollapsed: boolean;
  onCollapse: () => void;
  onClose: () => void;
  frameId: string;
}

export function FrameToolbar({
  title,
  isCollapsed,
  onCollapse,
  onClose,
  frameId,
}: FrameToolbarProps) {
  return (
    <div
      className="flex items-center justify-between px-3 py-2 h-10"
      role="toolbar"
      aria-label={`Frame toolbar for ${title}`}
    >
      {/* Drag Handle */}
      <div
        className="flex items-center gap-2 flex-1 min-w-0 cursor-move"
        role="button"
        aria-label={`Drag handle for ${title}. Use arrow keys to move frame.`}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            // Focus the frame element for keyboard navigation
            const frameElement = document.getElementById(frameId);
            frameElement?.focus();
          }
        }}
      >
        <GripVertical
          className="h-4 w-4 text-muted-foreground flex-shrink-0"
          aria-hidden="true"
        />
        <span
          className="text-sm font-medium truncate"
          title={title}
        >
          {title}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {/* Collapse/Expand Button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={onCollapse}
          aria-label={isCollapsed ? `Expand ${title}` : `Collapse ${title}`}
          title={isCollapsed ? 'Expand frame' : 'Collapse frame'}
        >
          {isCollapsed ? (
            <Maximize2 className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Minimize2 className="h-4 w-4" aria-hidden="true" />
          )}
        </Button>

        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 hover:bg-destructive hover:text-destructive-foreground"
          onClick={onClose}
          aria-label={`Close ${title}`}
          title="Close frame"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
