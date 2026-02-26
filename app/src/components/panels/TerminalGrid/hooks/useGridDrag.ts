
import { useState, useCallback } from "react";

export function useGridDrag(pIds: string[], setProjects: any, overviewId: string, containerRef: React.RefObject<HTMLDivElement>, cols: number, rows: number) {
  const [localOrder, setLocalOrder] = useState<string[]>(pIds);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const handleDrag = useCallback((id: string, info: any) => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const rects = Array.from(container.children).map(child => child.getBoundingClientRect());
    const currentIndex = localOrder.indexOf(id);
    
    let targetIndex = -1;
    for (let i = 0; i < rects.length; i++) {
      if (i === currentIndex) continue;
      const rect = rects[i];
      const margin = 30;
      if (info.point.x > rect.left + margin && info.point.x < rect.right - margin &&
          info.point.y > rect.top + margin && info.point.y < rect.bottom - margin) {
        targetIndex = i;
        break;
      }
    }

    if (targetIndex !== -1 && targetIndex !== currentIndex) {
      const next = [...localOrder];
      const [movedItem] = next.splice(currentIndex, 1);
      next.splice(targetIndex, 0, movedItem);
      setLocalOrder(next);
    }
  }, [localOrder, containerRef, cols, rows]);

  const onDragStart = useCallback((id: string) => setDraggingId(id), []);
  
  const onDragEnd = useCallback(() => {
    setDraggingId(null);
    setProjects(overviewId, localOrder);
  }, [overviewId, localOrder, setProjects]);

  return { localOrder, setLocalOrder, draggingId, handleDrag, onDragStart, onDragEnd };
}
