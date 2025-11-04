# Interactive Resizable Frame System

A comprehensive React component system for creating resizable, draggable, and closable frames with full keyboard accessibility and layout persistence.

## Features

- ✅ **Resizable**: Drag edges/corners to resize with live preview
- ✅ **Draggable**: Move frames by dragging the toolbar
- ✅ **Closable**: Close frames with the X button
- ✅ **Collapsible**: Minimize frames to just the toolbar
- ✅ **Keyboard Accessible**: Full keyboard navigation support
- ✅ **Touch Support**: Works on mobile/touch devices
- ✅ **Snap to Grid**: Optional 8px grid alignment
- ✅ **Layout Persistence**: Auto-saves to Supabase (debounced 700ms)
- ✅ **ARIA Support**: Screen reader announcements and proper roles
- ✅ **Smooth Animations**: Framer Motion powered transitions
- ✅ **Double-click Reset**: Double-click border to reset to default size

## Installation

```bash
npm install react-rnd @types/react-rnd framer-motion
```

The following packages are already included:
- `react-rnd` - For resizing and dragging
- `framer-motion` - For smooth animations
- `@supabase/supabase-js` - For layout persistence

## Quick Start

```tsx
import { Frame, FrameRect } from '@/components/frames/Frame';

function MyPage() {
  const initialRect: FrameRect = {
    x: 50,
    y: 50,
    width: 400,
    height: 300,
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '800px' }}>
      <Frame
        id="my-frame"
        initialRect={initialRect}
        title="My Frame"
        onChange={(rect) => console.log('Frame moved/resized:', rect)}
      >
        <div>Your content here</div>
      </Frame>
    </div>
  );
}
```

## Component API

### `Frame` Component

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | **required** | Unique identifier for the frame |
| `initialRect` | `FrameRect` | **required** | Initial position and size |
| `title` | `string` | `Frame {id}` | Frame title displayed in toolbar |
| `onChange` | `(rect: FrameRect) => void` | `undefined` | Called when frame is moved or resized |
| `onClose` | `() => void` | `undefined` | Called when close button is clicked |
| `onCollapse` | `(collapsed: boolean) => void` | `undefined` | Called when frame is collapsed/expanded |
| `minSize` | `{ width: number; height: number }` | `{ width: 200, height: 150 }` | Minimum frame dimensions |
| `maxSize` | `{ width: number; height: number }` | `undefined` | Maximum frame dimensions |
| `defaultSize` | `FrameRect` | `undefined` | Size to restore on double-click |
| `snapToGrid` | `boolean` | `false` | Enable 8px grid snapping |
| `gridSize` | `number` | `8` | Grid size in pixels |
| `className` | `string` | `undefined` | Additional CSS classes |
| `aria-label` | `string` | `title` | ARIA label for screen readers |
| `children` | `ReactNode` | **required** | Frame content |

#### `FrameRect` Interface

```typescript
interface FrameRect {
  x: number;      // X position in pixels
  y: number;      // Y position in pixels
  width: number;  // Width in pixels
  height: number; // Height in pixels
}
```

## Usage Examples

### Basic Frame

```tsx
<Frame
  id="basic-frame"
  initialRect={{ x: 100, y: 100, width: 300, height: 200 }}
  title="Basic Frame"
>
  <p>Simple frame with default settings</p>
</Frame>
```

### Frame with Layout Persistence

```tsx
import { useFrameLayout } from '@/hooks/useFrameLayout';

function PersistentFramePage() {
  const { layouts, updateFrame } = useFrameLayout('my-layout');
  
  const defaultRect = { x: 50, y: 50, width: 400, height: 300 };
  const savedRect = layouts['my-frame'] || defaultRect;

  return (
    <Frame
      id="my-frame"
      initialRect={savedRect}
      title="Persistent Frame"
      onChange={(rect) => updateFrame('my-frame', rect)}
    >
      <div>This frame saves its position!</div>
    </Frame>
  );
}
```

### Multiple Frames with Constraints

```tsx
<Frame
  id="constrained-frame"
  initialRect={{ x: 0, y: 0, width: 500, height: 400 }}
  title="Constrained Frame"
  minSize={{ width: 250, height: 200 }}
  maxSize={{ width: 800, height: 600 }}
  snapToGrid={true}
  gridSize={8}
>
  <div>This frame has size constraints and snaps to grid</div>
</Frame>
```

### Frame with Custom Actions

```tsx
<Frame
  id="custom-frame"
  initialRect={{ x: 100, y: 100, width: 400, height: 300 }}
  title="Custom Frame"
  onClose={() => {
    console.log('Frame closed!');
    // Handle close logic
  }}
  onCollapse={(collapsed) => {
    console.log('Frame collapsed:', collapsed);
    // Handle collapse logic
  }}
  onChange={(rect) => {
    console.log('Frame changed:', rect);
    // Handle resize/move logic
  }}
>
  <div>Frame with custom handlers</div>
</Frame>
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Tab` | Focus next frame |
| `Arrow Keys` | Nudge frame position (5px) |
| `Shift + Arrow Keys` | Nudge frame position (20px) |
| `Enter` | Activate focused frame |
| `Escape` | Cancel drag/resize operation |

## Mouse & Touch Interactions

- **Resize**: Hover over frame edges/corners, then drag
- **Move**: Click and drag the toolbar area
- **Collapse**: Click the minimize button (top-right)
- **Close**: Click the X button (top-right)
- **Reset Size**: Double-click the frame border

## Layout Persistence Hook

### `useFrameLayout(layoutName?: string)`

Manages frame layouts with automatic saving to Supabase.

```typescript
const {
  layouts,        // Current layout state
  isLoading,      // Loading state
  isSaving,       // Saving state
  updateFrame,    // Update a single frame
  removeFrame,    // Remove a frame from layout
  clearLayout,    // Clear all layouts
} = useFrameLayout('my-layout-name');
```

#### Example

```tsx
function FrameDashboard() {
  const { layouts, updateFrame, isLoading } = useFrameLayout('dashboard');

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <Frame
        id="widget-1"
        initialRect={layouts['widget-1'] || defaultRect}
        onChange={(rect) => updateFrame('widget-1', rect)}
      >
        Widget 1
      </Frame>
    </div>
  );
}
```

## API Routes

### Save Layout

```typescript
POST /api/saveLayout
Body: {
  layoutData: FrameLayout,
  layoutName?: string  // Default: 'default'
}
```

### Get Layout

```typescript
GET /api/saveLayout?layoutName=my-layout
Response: {
  success: boolean,
  layout: {
    id: string,
    user_id: string,
    layout_name: string,
    layout_data: FrameLayout,
    created_at: string,
    updated_at: string
  } | null
}
```

### Delete Layout

```typescript
DELETE /api/saveLayout?layoutName=my-layout
Response: {
  success: boolean
}
```

## Database Schema

The `frame_layouts` table stores user layouts:

```sql
CREATE TABLE frame_layouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  layout_name TEXT NOT NULL DEFAULT 'default',
  layout_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, layout_name)
);
```

### Example Queries

```sql
-- Get user's layout
SELECT layout_data 
FROM frame_layouts 
WHERE user_id = 'user-uuid' AND layout_name = 'dashboard';

-- Get all layouts for user
SELECT layout_name, layout_data, updated_at 
FROM frame_layouts 
WHERE user_id = 'user-uuid'
ORDER BY updated_at DESC;

-- Update layout
UPDATE frame_layouts
SET layout_data = '{"frame-1": {"x": 100, "y": 100, "width": 400, "height": 300}}'
WHERE user_id = 'user-uuid' AND layout_name = 'dashboard';
```

## Accessibility

### ARIA Attributes

- `role="region"` - Identifies frame as a landmark
- `aria-label` - Describes the frame
- `aria-expanded` - Indicates collapse state
- `role="status"` - Live region for announcements
- `aria-live="polite"` - Announces changes without interrupting

### Keyboard Navigation

1. Tab to focus a frame
2. Arrow keys to move (Shift for bigger steps)
3. Enter to activate
4. Escape to cancel operations

### Screen Reader Support

- Announcements for size changes: "Frame resized to 400 by 300 pixels"
- Announcements for position changes: "Frame moved to position 100, 100"
- Announcements for collapse/close actions

## Styling

Frames use TailwindCSS classes. Customize by:

1. **Global Styles**: Modify `.frame-container` and `.frame-resize-handle` in `Frame.tsx`
2. **Props**: Pass `className` prop to add custom classes
3. **Theme**: Frames respect your theme's `card`, `border`, `background` colors

### Custom Styling Example

```tsx
<Frame
  id="styled-frame"
  initialRect={rect}
  className="border-4 border-primary shadow-2xl"
>
  <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50">
    Custom styled content
  </div>
</Frame>
```

## Performance

- **Debouncing**: Layout saves are debounced by 700ms
- **Virtualization**: Not included, but recommended for 20+ frames
- **Optimization**: Uses `useCallback` and `useMemo` where appropriate
- **Animation**: Framer Motion handles 60fps animations

### Performance Tips

1. Limit to ~20 frames per page for optimal performance
2. Use `React.memo` for expensive frame content
3. Consider virtual scrolling for many frames
4. Debounce expensive `onChange` callbacks

## Testing

### Unit Tests

```bash
npm test -- Frame.test.tsx
```

Tests cover:
- Rendering and props
- Resize logic
- Keyboard navigation
- Accessibility features
- Event handlers

### E2E Tests

```bash
npx playwright test e2e/frame-lab.spec.ts
```

Tests cover:
- Mouse interactions
- Touch events
- Keyboard navigation
- Layout persistence
- Responsive behavior

## Troubleshooting

### Frame Not Resizing

- Ensure parent container has `position: relative` and defined dimensions
- Check that `minSize`/`maxSize` constraints aren't blocking
- Verify `enableResizing` prop isn't disabled

### Layout Not Persisting

- Check authentication (layouts require logged-in user)
- Verify Supabase connection and RLS policies
- Check browser console for API errors
- Ensure debounce delay has passed (700ms)

### Keyboard Not Working

- Ensure frame has focus (Tab to it first)
- Check that input fields aren't intercepting keys
- Verify `tabIndex={0}` is set on frame element

### Touch Not Working on Mobile

- Ensure touch events are enabled in `react-rnd`
- Check viewport meta tag in HTML
- Test on actual device, not just emulator

## Examples

See `app/frame-lab/page.tsx` for a complete working example with:
- Multiple frames
- Layout persistence
- Snap-to-grid toggle
- Reset functionality
- Responsive design

## License

MIT

## Contributing

Contributions welcome! Please ensure:
- ✅ All tests pass
- ✅ Accessibility guidelines followed
- ✅ TypeScript types are correct
- ✅ Documentation is updated
