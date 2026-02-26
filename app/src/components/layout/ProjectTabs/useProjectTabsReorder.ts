
import { useCallback } from "react";

export function useProjectTabsReorder(allTabs: any[], setGlobalTabsOrder: (o: string[]) => void, setIsDragging: (v: boolean) => void) {
  const handleDrag = useCallback(() => {
    setIsDragging(true);
  }, [setIsDragging]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, [setIsDragging]);

  const handleReorder = useCallback((newTabs: any[]) => {
    setGlobalTabsOrder(newTabs.map(t => t.id));
  }, [setGlobalTabsOrder]);

  return { handleDrag, handleDragEnd, handleReorder };
}
