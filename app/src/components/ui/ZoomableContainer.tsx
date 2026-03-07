
import { useRef, memo, ReactNode } from 'react';
import { useZoomPan } from './ZoomableContainer/index';

export const ZoomableContainer = memo(({ children }: { children: ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scale, pos, isPanning, onWheel, onDown, onMove, stop } = useZoomPan(ref);

  return (
    <div ref={ref} onWheel={onWheel} onMouseDown={onDown} onMouseMove={onMove} onMouseUp={stop} onMouseLeave={stop} onContextMenu={(e) => e.preventDefault()} className={`relative flex-1 overflow-hidden bg-sidebar-bg ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}>
      <div className="w-full h-full flex items-center justify-center" style={{ transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`, transformOrigin: '0 0', transition: isPanning ? 'none' : 'transform 0.1s ease-out' }}>
        <div className="min-w-full min-h-full flex items-center justify-center">{children}</div>
      </div>
      <div className="absolute bottom-4 right-4 bg-panel-bg border border-border text-foreground/50 text-[9px] font-black px-3 py-1.5 rounded-full pointer-events-none z-30 shadow-sm uppercase tracking-widest">
        {Math.round(scale * 100)}%
      </div>
      <div className="absolute top-4 right-4 text-[8px] text-foreground/40 font-medium pointer-events-none bg-panel-bg/50 px-2 py-1 rounded">
        Scroll: Zoom • Right Click: Pan
      </div>
    </div>
  );
});

ZoomableContainer.displayName = 'ZoomableContainer';
