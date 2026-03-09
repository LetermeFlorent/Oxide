/**
 * @file DraggableHandle.tsx
 * @description Resizable panel drag handle component
 * Visual handle for resizing panels with hover and active states
 *
 * Features:
 * - Horizontal and vertical orientations
 * - Visual feedback on hover and drag
 * - Cursor changes to indicate resize direction
 *
 * @component DraggableHandle
 */

import { memo } from "react";

/**
 * DraggableHandle Component
 *
 * A visual handle that users can drag to resize adjacent panels.
 * Changes appearance on hover and when actively being dragged.
 *
 * @param props - Component props
 * @param props.onMouseDown - Mouse down handler to start resize
 * @param props.vertical - Whether this is a vertical (row) resize handle
 * @returns The draggable handle element
 */
export const DraggableHandle = memo(({ onMouseDown, vertical = false }: any) => (
  <div
    onMouseDown={onMouseDown}
    className={`${vertical ? 'h-1 w-full cursor-row-resize' : 'w-1 h-full cursor-col-resize'}
    bg-transparent shrink-0 z-50`}
  />
));

DraggableHandle.displayName = 'DraggableHandle';
