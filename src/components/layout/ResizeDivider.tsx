/**
 * @file ResizeDivider.tsx
 * @description Resizable panel divider using react-resizable-panels
 * Provides a draggable divider between resizable panels
 *
 * Features:
 * - Integration with react-resizable-panels library
 * - Horizontal and vertical orientations
 * - Hover effect for better UX
 * - Fallback when library is unavailable
 *
 * @component ResizeDivider
 */

import * as Panels from "react-resizable-panels";

/**
 * Props for the ResizeDivider component
 * @interface ResizeDividerProps
 */
interface ResizeDividerProps {
  /** Whether the divider should be vertical (for row layout) */
  vertical?: boolean;
}

/**
 * ResizeDivider Component
 *
 * A divider that separates resizable panels from react-resizable-panels.
 * Shows visual feedback on hover to indicate it can be dragged.
 *
 * @param props - Component props
 * @returns The resize divider element
 */
export const ResizeDivider = ({ vertical = false }: ResizeDividerProps) => {
  const Handle = (Panels as any).PanelResizeHandle || (Panels as any).default;
  if (!Handle) return <div className={`${vertical ? 'h-1 w-full' : 'w-1 h-full'} bg-gray-200`} />;

  return (
    <Handle
      className={`${vertical ? 'h-1.5 w-full' : 'w-1.5 h-full'}
      bg-transparent hover:bg-gray-600/30 transition-colors z-50 shrink-0`}
    />
  );
};
