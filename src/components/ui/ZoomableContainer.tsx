import { useState, useRef, useCallback, memo, ReactNode } from 'react';

/**
 * @file ZoomableContainer.tsx
 * @description Container component with zoom and pan functionality for images and PDFs
 * Provides mouse-based zoom (scroll) and pan (right-click drag) interactions
 *
 * Features:
 * - Mouse wheel zooming centered on cursor position
 * - Right-click and drag to pan
 * - Zoom level indicator overlay
 * - Smooth transitions
 *
 * @component ZoomableContainer
 */

/**
 * Props for the ZoomableContainer component
 * @interface ZoomableContainerProps
 */
interface ZoomableContainerProps {
  /** Child content to display within the zoomable area */
  children: ReactNode;
}

/**
 * ZoomableContainer Component
 *
 * A container that allows users to zoom in/out with the mouse wheel
 * and pan by right-clicking and dragging. Useful for viewing images
 * and PDFs at different magnifications.
 *
 * @param props - Component props
 * @returns The zoomable container with child content
 */
export const ZoomableContainer = memo(({ children }: ZoomableContainerProps) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastPos = useRef({ x: 0, y: 0 });

  /**
   * Handles mouse wheel events for zooming
   * Zooms centered on the mouse cursor position
   */
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    // Zoom centered on mouse position
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newScale = Math.min(Math.max(scale * delta, 0.1), 10);

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Calculate new position to keep mouse over the same point
      const newX = mouseX - (mouseX - position.x) * (newScale / scale);
      const newY = mouseY - (mouseY - position.y) * (newScale / scale);

      setScale(newScale);
      setPosition({ x: newX, y: newY });
    }
  }, [scale, position]);

  /**
   * Handles mouse down events to start panning
   * Right-click (button 2) initiates pan mode
   */
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 2) { // Right click
      setIsPanning(true);
      lastPos.current = { x: e.clientX, y: e.clientY };
      e.preventDefault();
    }
  }, []);

  /**
   * Handles mouse move events for panning
   * Updates position based on mouse delta while panning
   */
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;

      setPosition(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      lastPos.current = { x: e.clientX, y: e.clientY };
    }
  }, [isPanning]);

  /**
   * Handles mouse up events to stop panning
   */
  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  /**
   * Prevents default context menu on right-click
   */
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onContextMenu={handleContextMenu}
      className={`relative flex-1 overflow-hidden bg-[#fafafa] ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
    >
      <div
        className="w-full h-full flex items-center justify-center"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: '0 0',
          transition: isPanning ? 'none' : 'transform 0.1s ease-out'
        }}
      >
        <div className="min-w-full min-h-full flex items-center justify-center">
          {children}
        </div>
      </div>

      <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-md border border-gray-100 text-gray-500 text-[9px] font-black px-3 py-1.5 rounded-full pointer-events-none z-30 shadow-sm uppercase tracking-widest">
        Zoom: {Math.round(scale * 100)}%
      </div>

      {/* Instructions Overlay (briefly shown) */}
      <div className="absolute top-4 right-4 text-[8px] text-gray-400 font-medium pointer-events-none bg-white/50 px-2 py-1 rounded">
        Scroll: Zoom • Right Click: Pan
      </div>
    </div>
  );
});

ZoomableContainer.displayName = 'ZoomableContainer';
