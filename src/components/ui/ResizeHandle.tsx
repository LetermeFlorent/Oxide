/**
 * @file ResizeHandle.tsx
 * @description Alternative resize handle with percentage-based delta calculation
 * Calculates resize deltas as percentage of viewport dimensions
 *
 * Features:
 * - Percentage-based resize calculations
 * - Horizontal and vertical orientations
 * - Automatic cleanup of event listeners
 *
 * @component ResizeHandle
 */

/**
 * Props for the ResizeHandle component
 * @interface ResizeHandleProps
 */
interface ResizeHandleProps {
  /** Callback fired with resize delta as percentage */
  onResize: (delta: number) => void;
  /** Whether to resize vertically (default: horizontal) */
  vertical?: boolean;
}

/**
 * ResizeHandle Component
 *
 * A resize handle that calculates movement as a percentage of the viewport.
 * Useful for percentage-based layouts.
 *
 * @param props - Component props
 * @returns The resize handle element
 */
export const ResizeHandle = ({ onResize, vertical = false }: ResizeHandleProps) => {
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const onMouseMove = (me: MouseEvent) => {
      const delta = vertical
        ? (me.movementY / window.innerHeight) * 100
        : (me.movementX / window.innerWidth) * 100;
      onResize(delta);
    };
    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      className={`${vertical ? 'h-1.5 w-full cursor-row-resize' : 'w-1.5 h-full cursor-col-resize'}
      bg-transparent hover:bg-indigo-400/30 transition-colors z-50 shrink-0`}
    />
  );
};
