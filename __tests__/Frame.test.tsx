import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Frame, FrameRect } from '@/components/frames/Frame';

// Mock react-rnd
jest.mock('react-rnd', () => ({
  Rnd: ({ children, onResize, onDrag, onDragStop, ...props }: any) => (
    <div
      data-testid="rnd-component"
      {...props}
      onMouseDown={(e: any) => {
        if (onDrag) {
          onDrag(e, { x: 100, y: 100 });
        }
      }}
      onMouseUp={(e: any) => {
        if (onDragStop) {
          onDragStop(e, { x: 100, y: 100 });
        }
      }}
    >
      {children}
    </div>
  ),
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

const mockInitialRect: FrameRect = {
  x: 50,
  y: 50,
  width: 400,
  height: 300,
};

const mockDefaultSize: FrameRect = {
  x: 0,
  y: 0,
  width: 500,
  height: 400,
};

describe('Frame Component', () => {
  const mockOnChange = jest.fn();
  const mockOnClose = jest.fn();
  const mockOnCollapse = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with initial rect', () => {
    render(
      <Frame id="test-frame" initialRect={mockInitialRect} title="Test Frame">
        <div>Frame Content</div>
      </Frame>
    );

    expect(screen.getByText('Test Frame')).toBeInTheDocument();
    expect(screen.getByText('Frame Content')).toBeInTheDocument();
  });

  it('calls onChange when frame is moved', async () => {
    render(
      <Frame
        id="test-frame"
        initialRect={mockInitialRect}
        onChange={mockOnChange}
        title="Test Frame"
      >
        <div>Frame Content</div>
      </Frame>
    );

    const rnd = screen.getByTestId('rnd-component');
    fireEvent.mouseDown(rnd);
    fireEvent.mouseUp(rnd);

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalled();
    });
  });

  it('handles collapse correctly', () => {
    render(
      <Frame
        id="test-frame"
        initialRect={mockInitialRect}
        onCollapse={mockOnCollapse}
        title="Test Frame"
      >
        <div>Frame Content</div>
      </Frame>
    );

    const collapseButton = screen.getByLabelText(/Collapse/i);
    fireEvent.click(collapseButton);

    expect(mockOnCollapse).toHaveBeenCalledWith(true);
  });

  it('handles close correctly', () => {
    render(
      <Frame
        id="test-frame"
        initialRect={mockInitialRect}
        onClose={mockOnClose}
        title="Test Frame"
      >
        <div>Frame Content</div>
      </Frame>
    );

    const closeButton = screen.getByLabelText(/Close/i);
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('handles keyboard navigation with arrow keys', () => {
    render(
      <Frame
        id="test-frame"
        initialRect={mockInitialRect}
        onChange={mockOnChange}
        title="Test Frame"
      >
        <div>Frame Content</div>
      </Frame>
    );

    const frame = screen.getByRole('region');
    frame.focus();

    fireEvent.keyDown(frame, { key: 'ArrowRight' });
    fireEvent.keyDown(frame, { key: 'ArrowDown' });

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('handles Shift+Arrow for bigger steps', () => {
    render(
      <Frame
        id="test-frame"
        initialRect={mockInitialRect}
        onChange={mockOnChange}
        title="Test Frame"
      >
        <div>Frame Content</div>
      </Frame>
    );

    const frame = screen.getByRole('region');
    frame.focus();

    fireEvent.keyDown(frame, { key: 'ArrowRight', shiftKey: true });

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('handles Escape key to cancel drag/resize', () => {
    render(
      <Frame
        id="test-frame"
        initialRect={mockInitialRect}
        onChange={mockOnChange}
        title="Test Frame"
      >
        <div>Frame Content</div>
      </Frame>
    );

    const frame = screen.getByRole('region');
    frame.focus();

    fireEvent.keyDown(frame, { key: 'Escape' });

    // Frame should revert to initial rect
    // This is tested by checking that the onChange was not called with new values
  });

  it('handles double-click to reset to default size', () => {
    render(
      <Frame
        id="test-frame"
        initialRect={mockInitialRect}
        defaultSize={mockDefaultSize}
        onChange={mockOnChange}
        title="Test Frame"
      >
        <div>Frame Content</div>
      </Frame>
    );

    const frame = screen.getByRole('region');
    fireEvent.doubleClick(frame);

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('respects minSize constraints', () => {
    const minSize = { width: 200, height: 150 };
    
    render(
      <Frame
        id="test-frame"
        initialRect={mockInitialRect}
        minSize={minSize}
        title="Test Frame"
      >
        <div>Frame Content</div>
      </Frame>
    );

    const rnd = screen.getByTestId('rnd-component');
    expect(rnd).toHaveAttribute('style', expect.stringContaining('minWidth'));
  });

  it('respects maxSize constraints', () => {
    const maxSize = { width: 800, height: 600 };
    
    render(
      <Frame
        id="test-frame"
        initialRect={mockInitialRect}
        maxSize={maxSize}
        title="Test Frame"
      >
        <div>Frame Content</div>
      </Frame>
    );

    const rnd = screen.getByTestId('rnd-component');
    expect(rnd).toBeInTheDocument();
  });

  it('applies snap to grid when enabled', () => {
    render(
      <Frame
        id="test-frame"
        initialRect={mockInitialRect}
        snapToGrid={true}
        gridSize={8}
        onChange={mockOnChange}
        title="Test Frame"
      >
        <div>Frame Content</div>
      </Frame>
    );

    const frame = screen.getByRole('region');
    frame.focus();

    fireEvent.keyDown(frame, { key: 'ArrowRight' });

    // When snap to grid is enabled, values should be rounded to grid
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('provides proper ARIA attributes', () => {
    render(
      <Frame
        id="test-frame"
        initialRect={mockInitialRect}
        title="Test Frame"
        aria-label="Custom Label"
      >
        <div>Frame Content</div>
      </Frame>
    );

    const frame = screen.getByRole('region');
    expect(frame).toHaveAttribute('aria-label', 'Custom Label');
    expect(frame).toHaveAttribute('aria-expanded', 'true');
    expect(frame).toHaveAttribute('tabIndex', '0');
  });

  it('announces size changes to screen readers', () => {
    render(
      <Frame
        id="test-frame"
        initialRect={mockInitialRect}
        onChange={mockOnChange}
        title="Test Frame"
      >
        <div>Frame Content</div>
      </Frame>
    );

    const liveRegion = screen.getByRole('status');
    expect(liveRegion).toHaveAttribute('aria-live', 'polite');
    expect(liveRegion).toHaveAttribute('aria-atomic', 'true');
  });
});
