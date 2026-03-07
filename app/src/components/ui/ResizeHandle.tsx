
import { memo } from "react";

export const ResizeHandle = memo(({ onMouseDown, onResize, vertical = false }: any) => {
  const handleMouseDown = (e: React.MouseEvent) => {
    if (onMouseDown) return onMouseDown(e);
    if (!onResize) return;
    
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
      bg-transparent hover:bg-hover-bg active:bg-active-bg transition-all z-50 shrink-0`}
    />
  );
});

ResizeHandle.displayName = 'ResizeHandle';
