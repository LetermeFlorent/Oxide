import { useState, useEffect, useRef } from "react";
import { treeWorker as worker } from "../../../utils/tree/treeWorkerInstance";

export const ITEM_HEIGHT = 28;

export function useSidebarWorker(ap: any, expanded: any, q: string) {
  const [scrollTop, setScrollTop] = useState(0);
  const [h, setH] = useState(0);
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState<any[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timer = useRef<any>(null);

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
    if (!ap?.tree || ap.isLoading) { setCount(0); return; }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      // Send the WHOLE tree only when it changes
      worker.postMessage({ type: 'COUNT_EXPANDED', nodes: ap.tree, expandedFolders: expanded, searchQuery: q });
    }, 200);
  }, [ap?.tree, expanded, q, ap?.isLoading]);

  useEffect(() => {
    if (ap?.isLoading || !ap?.tree) { setVisible([]); return; }
    const start = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - 5);
    const end = Math.min(count, Math.ceil((scrollTop + h) / ITEM_HEIGHT) + 5);
    
    // Optimize: Don't send the tree again, just send indices
    requestAnimationFrame(() => {
      worker.postMessage({ type: 'GET_VISIBLE_TREE', nodes: null, startIndex: start, endIndex: end });
    });
  }, [scrollTop, h, count, ap?.isLoading]); // Only re-render on scroll/height/count change


  return { scrollRef, setScrollTop, scrollTop, expandedCount: count, visibleItems: visible };
}
