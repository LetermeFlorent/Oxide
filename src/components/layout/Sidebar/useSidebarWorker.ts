import { useState, useEffect, useRef } from "react";
import { treeWorker as worker } from "../../../utils/treeWorkerInstance";

export const ITEM_HEIGHT = 28;

export function useSidebarWorker(activeProject: any, expandedFolders: any, searchQuery: string) {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [expandedCount, setExpandedCount] = useState(0);
  const [visibleItems, setVisibleItems] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data.type === 'COUNT_EXPANDED_RESULT') setExpandedCount(e.data.count);
      else if (e.data.type === 'GET_VISIBLE_TREE_RESULT') setVisibleItems(e.data.visibleItems);
    };
    worker.addEventListener('message', handleMessage);
    return () => worker.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    if (!activeProject?.tree || searchQuery.trim()) { setExpandedCount(0); return; }
    worker.postMessage({ type: 'COUNT_EXPANDED', nodes: activeProject.tree, expandedFolders });
  }, [activeProject?.tree, expandedFolders, searchQuery]);

  useEffect(() => {
    if (searchQuery.trim() || activeProject?.isLoading || !activeProject?.tree) { setVisibleItems([]); return; }
    const start = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - 5);
    const end = Math.min(expandedCount, Math.ceil((scrollTop + containerHeight) / ITEM_HEIGHT) + 5);
    worker.postMessage({ type: 'GET_VISIBLE_TREE', nodes: activeProject.tree, expandedFolders, startIndex: start, endIndex: end });
  }, [activeProject?.tree, expandedCount, expandedFolders, scrollTop, containerHeight, searchQuery, activeProject?.isLoading]);

  return { scrollRef, scrollTop, setScrollTop, containerHeight, setContainerHeight, expandedCount, visibleItems };
}
