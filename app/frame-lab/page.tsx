'use client';

import React, { useState, useEffect } from 'react';
import { Frame, FrameRect } from '@/components/frames/Frame';
import { useFrameLayout } from '@/hooks/useFrameLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, RefreshCw, Trash2 } from 'lucide-react';
import { AuthGuard } from '@/components/auth-guard';

const DEMO_FRAMES = [
  {
    id: 'frame-1',
    title: 'Project Overview',
    defaultSize: { x: 50, y: 50, width: 400, height: 300 },
  },
  {
    id: 'frame-2',
    title: 'Design Elements',
    defaultSize: { x: 500, y: 50, width: 350, height: 250 },
  },
  {
    id: 'frame-3',
    title: 'Color Palette',
    defaultSize: { x: 50, y: 400, width: 300, height: 200 },
  },
  {
    id: 'frame-4',
    title: 'Components Library',
    defaultSize: { x: 400, y: 350, width: 450, height: 300 },
  },
  {
    id: 'frame-5',
    title: 'Code Snippets',
    defaultSize: { x: 900, y: 50, width: 350, height: 400 },
  },
];

function FrameLabContent() {
  const { layouts, isLoading, isSaving, updateFrame, removeFrame, clearLayout } =
    useFrameLayout('frame-lab');
  const [visibleFrames, setVisibleFrames] = useState<Set<string>>(
    new Set(DEMO_FRAMES.map((f) => f.id))
  );
  const [snapToGrid, setSnapToGrid] = useState(true);

  const handleFrameChange = (frameId: string) => (rect: FrameRect) => {
    updateFrame(frameId, rect);
  };

  const handleFrameClose = (frameId: string) => () => {
    setVisibleFrames((prev) => {
      const next = new Set(prev);
      next.delete(frameId);
      return next;
    });
    removeFrame(frameId);
  };

  const handleResetLayout = () => {
    clearLayout();
    setVisibleFrames(new Set(DEMO_FRAMES.map((f) => f.id)));
    // Force re-render by updating state
    window.location.reload();
  };

  // Get frame rect from saved layout or use default
  const getFrameRect = (frameId: string, defaultRect: FrameRect): FrameRect => {
    if (layouts[frameId]) {
      return layouts[frameId];
    }
    return defaultRect;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Card className="mb-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Interactive Frame Lab</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Resize, drag, collapse, and close frames. Layout persists automatically.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={snapToGrid ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSnapToGrid(!snapToGrid)}
                >
                  Snap to Grid {snapToGrid ? 'ON' : 'OFF'}
                </Button>
                {isSaving && (
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </span>
                )}
                <Button variant="outline" size="sm" onClick={handleResetLayout}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset Layout
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Instructions */}
        <Card className="mb-4 bg-muted/50">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <h3 className="font-semibold mb-2">Mouse & Touch</h3>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Hover edges/corners to resize</li>
                  <li>• Drag toolbar to move</li>
                  <li>• Double-click border for default size</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Keyboard</h3>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Tab to focus frame</li>
                  <li>• Arrow keys to nudge</li>
                  <li>• Shift+Arrow for bigger steps</li>
                  <li>• Esc to cancel drag/resize</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Controls</h3>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Minimize: Collapse frame</li>
                  <li>• X: Close frame</li>
                  <li>• Layout auto-saves</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Frame Container */}
        <div
          className="relative border-2 border-dashed border-muted rounded-lg p-4 min-h-[800px] bg-muted/20"
          style={{ position: 'relative', width: '100%', height: '100%' }}
        >
          {DEMO_FRAMES.map((frame) => {
            if (!visibleFrames.has(frame.id)) return null;

            const rect = getFrameRect(frame.id, frame.defaultSize);

            return (
              <Frame
                key={frame.id}
                id={frame.id}
                title={frame.title}
                initialRect={rect}
                defaultSize={frame.defaultSize}
                minSize={{ width: 200, height: 150 }}
                maxSize={{ width: 800, height: 600 }}
                snapToGrid={snapToGrid}
                gridSize={8}
                onChange={handleFrameChange(frame.id)}
                onClose={handleFrameClose(frame.id)}
                aria-label={`Resizable frame: ${frame.title}`}
              >
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">{frame.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    This is a demo frame. You can resize it by dragging the edges or corners,
                    move it by dragging the toolbar, or collapse/close it using the controls.
                  </p>
                  {frame.id === 'frame-1' && (
                    <div className="space-y-2">
                      <div className="h-20 bg-primary/10 rounded flex items-center justify-center">
                        Preview Area
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Frame dimensions: {Math.round(rect.width)} × {Math.round(rect.height)}px
                      </p>
                    </div>
                  )}
                  {frame.id === 'frame-2' && (
                    <div className="grid grid-cols-2 gap-2">
                      {['Button', 'Input', 'Card', 'Modal'].map((item) => (
                        <div
                          key={item}
                          className="p-3 border rounded hover:bg-muted transition-colors"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  )}
                  {frame.id === 'frame-3' && (
                    <div className="flex gap-2 flex-wrap">
                      {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'].map((color) => (
                        <div
                          key={color}
                          className="w-12 h-12 rounded border-2 border-border"
                          style={{ backgroundColor: color }}
                          title={color}
                        />
                      ))}
                    </div>
                  )}
                  {frame.id === 'frame-4' && (
                    <div className="space-y-2">
                      {['Card', 'Dialog', 'Dropdown', 'Tooltip'].map((comp) => (
                        <div key={comp} className="p-2 border rounded text-sm">
                          {comp}
                        </div>
                      ))}
                    </div>
                  )}
                  {frame.id === 'frame-5' && (
                    <div className="space-y-2 font-mono text-xs">
                      <div className="bg-muted p-2 rounded">
                        <code>const Component = () =&gt; ...</code>
                      </div>
                      <div className="bg-muted p-2 rounded">
                        <code>export default Component;</code>
                      </div>
                    </div>
                  )}
                </div>
              </Frame>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function FrameLabPage() {
  return (
    <AuthGuard>
      <FrameLabContent />
    </AuthGuard>
  );
}
