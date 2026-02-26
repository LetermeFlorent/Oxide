import { useState, useEffect, useRef } from "react";
import { treeWorker as worker } from "../../../utils/treeWorkerInstance";

export const ITEM_HEIGHT = 28;

export function useSidebarWorker(ap: any, expanded: any, q: string) {
  const [scrollTop, setScrollTop] = useState(0);
  const [h, setH] = useState(0);
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MessageEvent) => {
      if (e.data.type === 'COUNT_EXPANDED_RESULT') setCount(e.data.count);
      else if (e.data.type === 'GET_VISIBLE_TREE_RESULT') setVisible(e.data.visibleItems);
    };
    worker.addEventListener('message', handle);
    if (scrollRef.current) {
      const obs = new ResizeObserver(entries => setH(entries[0].contentRect.height));
      obs.observe(scrollRef.current);
      return () => { worker.removeEventListener('message', handle); obs.disconnect(); };
    }
    return () => worker.removeEventListener('message', handle);
  }, []);

  useEffect(() => {
    if (!ap?.tree) { setCount(0); return; }
    worker.postMessage({ type: 'COUNT_EXPANDED', nodes: ap.tree, expandedFolders: expanded, searchQuery: q });
  }, [ap?.tree, expanded, q]);

  useEffect(() => {
    if (ap?.isLoading || !ap?.tree) { setVisible([]); return; }
    const start = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - 5);
    const end = Math.min(count, Math.ceil((scrollTop + h) / ITEM_HEIGHT) + 5);
    worker.postMessage({ type: 'GET_VISIBLE_TREE', nodes: ap.tree, expandedFolders: expanded, startIndex: start, endIndex: end, searchQuery: q });
  }, [ap?.tree, count, expanded, scrollTop, h, q, ap?.isLoading]);

  return { scrollRef, setScrollTop, expandedCount: count, visibleItems: visible };
}
