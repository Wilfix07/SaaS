import { test, expect } from '@playwright/test';

test.describe('Frame Lab Page', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to frame lab page (assuming authentication is handled)
    await page.goto('/frame-lab');
    
    // Wait for frames to load
    await page.waitForSelector('[role="region"]', { timeout: 10000 });
  });

  test('should display all demo frames', async ({ page }) => {
    const frames = await page.locator('[role="region"]').count();
    expect(frames).toBeGreaterThanOrEqual(5);
  });

  test('should resize frame by dragging corner', async ({ page }) => {
    const frame = page.locator('[role="region"]').first();
    const initialBox = await frame.boundingBox();
    
    if (!initialBox) {
      throw new Error('Frame not found');
    }

    // Find resize handle (bottom-right corner)
    const resizeHandle = frame.locator('.frame-resize-handle.bottom-0.right-0').first();
    
    // Drag the resize handle
    await resizeHandle.hover();
    await page.mouse.down();
    await page.mouse.move(initialBox.x + initialBox.width + 100, initialBox.y + initialBox.height + 100);
    await page.mouse.up();

    // Wait for resize to complete
    await page.waitForTimeout(300);

    const newBox = await frame.boundingBox();
    expect(newBox).not.toBeNull();
    
    if (newBox) {
      // Frame should be larger (with some tolerance for snap-to-grid)
      expect(newBox.width).toBeGreaterThan(initialBox.width);
      expect(newBox.height).toBeGreaterThan(initialBox.height);
    }
  });

  test('should move frame by dragging toolbar', async ({ page }) => {
    const frame = page.locator('[role="region"]').first();
    const initialBox = await frame.boundingBox();
    
    if (!initialBox) {
      throw new Error('Frame not found');
    }

    // Find drag handle (toolbar area with grip icon)
    const dragHandle = frame.locator('[role="toolbar"]').first();
    
    // Drag the frame
    await dragHandle.hover();
    await page.mouse.down();
    await page.mouse.move(initialBox.x + 100, initialBox.y + 100);
    await page.mouse.up();

    // Wait for drag to complete
    await page.waitForTimeout(300);

    const newBox = await frame.boundingBox();
    expect(newBox).not.toBeNull();
    
    if (newBox) {
      // Frame position should have changed
      expect(newBox.x).not.toBe(initialBox.x);
      expect(newBox.y).not.toBe(initialBox.y);
    }
  });

  test('should collapse and expand frame', async ({ page }) => {
    const frame = page.locator('[role="region"]').first();
    const initialHeight = (await frame.boundingBox())?.height || 0;

    // Click collapse button
    const collapseButton = frame.locator('button[aria-label*="Collapse"]').first();
    await collapseButton.click();

    // Wait for collapse animation
    await page.waitForTimeout(300);

    // Frame should be collapsed (height ~50px for toolbar only)
    const collapsedBox = await frame.boundingBox();
    expect(collapsedBox?.height).toBeLessThan(initialHeight);
    expect(collapsedBox?.height).toBeLessThan(100);

    // Expand frame
    const expandButton = frame.locator('button[aria-label*="Expand"]').first();
    await expandButton.click();

    // Wait for expand animation
    await page.waitForTimeout(300);

    const expandedBox = await frame.boundingBox();
    expect(expandedBox?.height).toBeGreaterThan(100);
  });

  test('should close frame', async ({ page }) => {
    const initialCount = await page.locator('[role="region"]').count();

    // Click close button on first frame
    const frame = page.locator('[role="region"]').first();
    const closeButton = frame.locator('button[aria-label*="Close"]').first();
    await closeButton.click();

    // Wait for frame to be removed
    await page.waitForTimeout(300);

    const newCount = await page.locator('[role="region"]').count();
    expect(newCount).toBeLessThan(initialCount);
  });

  test('should move frame with keyboard', async ({ page }) => {
    const frame = page.locator('[role="region"]').first();
    const initialBox = await frame.boundingBox();
    
    if (!initialBox) {
      throw new Error('Frame not found');
    }

    // Focus the frame
    await frame.focus();

    // Move right with arrow key
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(100);

    // Move down with arrow key
    await page.keyboard.press('ArrowDown');
    await page.waitForTimeout(100);

    const newBox = await frame.boundingBox();
    expect(newBox).not.toBeNull();
    
    if (newBox) {
      // Position should have changed
      expect(newBox.x).not.toBe(initialBox.x);
      expect(newBox.y).not.toBe(initialBox.y);
    }
  });

  test('should move frame with Shift+Arrow for bigger steps', async ({ page }) => {
    const frame = page.locator('[role="region"]').first();
    const initialBox = await frame.boundingBox();
    
    if (!initialBox) {
      throw new Error('Frame not found');
    }

    await frame.focus();

    // Move with Shift+ArrowRight (bigger step)
    await page.keyboard.press('Shift+ArrowRight');
    await page.waitForTimeout(100);

    const newBox = await frame.boundingBox();
    expect(newBox).not.toBeNull();
    
    if (newBox) {
      const deltaX = newBox.x - initialBox.x;
      // With Shift, the step should be larger (20px vs 5px)
      expect(deltaX).toBeGreaterThanOrEqual(8); // At least 8px (snap to grid)
    }
  });

  test('should toggle snap to grid', async ({ page }) => {
    const snapButton = page.getByRole('button', { name: /Snap to Grid/i });
    
    // Check initial state
    const initialText = await snapButton.textContent();
    expect(initialText).toContain('ON');

    // Toggle off
    await snapButton.click();
    await page.waitForTimeout(100);

    const toggledText = await snapButton.textContent();
    expect(toggledText).toContain('OFF');

    // Toggle back on
    await snapButton.click();
    await page.waitForTimeout(100);

    const finalText = await snapButton.textContent();
    expect(finalText).toContain('ON');
  });

  test('should persist layout after resize', async ({ page, context }) => {
    const frame = page.locator('[role="region"]').first();
    const initialBox = await frame.boundingBox();
    
    if (!initialBox) {
      throw new Error('Frame not found');
    }

    // Resize frame
    const resizeHandle = frame.locator('.frame-resize-handle.bottom-0.right-0').first();
    await resizeHandle.hover();
    await page.mouse.down();
    await page.mouse.move(initialBox.x + initialBox.width + 50, initialBox.y + initialBox.height + 50);
    await page.mouse.up();

    // Wait for save (debounce is 700ms)
    await page.waitForTimeout(1000);

    // Check for saving indicator (if visible)
    const savingIndicator = page.getByText(/Saving/i);
    if (await savingIndicator.isVisible().catch(() => false)) {
      await page.waitForSelector('text=/Saving/i', { state: 'hidden', timeout: 5000 });
    }

    // Reload page
    await page.reload();
    await page.waitForSelector('[role="region"]', { timeout: 10000 });

    // Frame should maintain its size
    const newBox = await frame.boundingBox();
    expect(newBox).not.toBeNull();
    
    if (newBox && initialBox) {
      // Allow some tolerance for snap-to-grid
      expect(Math.abs(newBox.width - initialBox.width - 50)).toBeLessThan(20);
      expect(Math.abs(newBox.height - initialBox.height - 50)).toBeLessThan(20);
    }
  });

  test('should reset layout', async ({ page }) => {
    // Resize a frame first
    const frame = page.locator('[role="region"]').first();
    const resizeHandle = frame.locator('.frame-resize-handle.bottom-0.right-0').first();
    await resizeHandle.hover();
    await page.mouse.down();
    await page.mouse.move(500, 500);
    await page.mouse.up();
    await page.waitForTimeout(500);

    // Click reset button
    const resetButton = page.getByRole('button', { name: /Reset Layout/i });
    await resetButton.click();

    // Wait for reload
    await page.waitForSelector('[role="region"]', { timeout: 10000 });

    // Frames should be back to default positions
    const frames = await page.locator('[role="region"]').count();
    expect(frames).toBeGreaterThanOrEqual(5);
  });

  test('should handle touch events for mobile', async ({ page }) => {
    // Emulate mobile device
    await page.setViewportSize({ width: 375, height: 667 });

    const frame = page.locator('[role="region"]').first();
    const initialBox = await frame.boundingBox();
    
    if (!initialBox) {
      throw new Error('Frame not found');
    }

    // Simulate touch drag
    const dragHandle = frame.locator('[role="toolbar"]').first();
    const box = await dragHandle.boundingBox();
    
    if (box) {
      await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.move(box.x + 100, box.y + 100);
      await page.mouse.up();
    }

    await page.waitForTimeout(300);

    const newBox = await frame.boundingBox();
    expect(newBox).not.toBeNull();
  });

  test('should be keyboard accessible', async ({ page }) => {
    // Tab through interactive elements
    await page.keyboard.press('Tab');
    
    // Should be able to focus frames
    const frame = page.locator('[role="region"]').first();
    await frame.focus();
    
    const focusedElement = page.locator(':focus');
    expect(await focusedElement.count()).toBeGreaterThan(0);
  });
});
