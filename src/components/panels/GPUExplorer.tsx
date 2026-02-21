import React, { useRef, useEffect, useState, memo } from 'react';
import { useStore } from '../../store/useStore';
import { selectActiveProject } from '../../store/selectors';
import { useSidebarWorker } from '../layout/Sidebar/useSidebarWorker';
import { useGPUDraw } from './GPUExplorer/useGPUDraw';

export const GPUExplorer = memo(({ onFileClick }: { onFileClick: (file: any) => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeProject = useStore(selectActiveProject);
  const expandedFolders = useStore(s => s.expandedFolders);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const { scrollRef, setScrollTop, scrollTop, expandedCount, visibleItems } = useSidebarWorker(activeProject, expandedFolders, "");

  useGPUDraw(canvasRef, visibleItems, scrollTop, dimensions);

  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver(e => setDimensions({ width: e[0].contentRect.width, height: e[0].contentRect.height }));
    obs.observe(containerRef.current); return () => obs.disconnect();
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const y = e.clientY - rect.top + scrollTop;
    const item = visibleItems.find(i => i.index === Math.floor(y / 24));
    if (item) onFileClick(item.entry);
  };

  return (
    <div ref={containerRef} className="flex-1 relative overflow-hidden bg-white select-none">
      <div ref={scrollRef} className="absolute inset-0 overflow-y-auto scrollbar-modern" onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}>
        <div style={{ height: expandedCount * 24, pointerEvents: 'none' }} />
      </div>
      <canvas ref={canvasRef} onClick={handleClick} className="absolute inset-0 pointer-events-auto" />
    </div>
  );
});
