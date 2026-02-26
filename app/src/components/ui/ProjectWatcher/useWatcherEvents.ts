
import { useEffect, useRef } from "react";
import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/core";
import { useStore } from "../../../store/useStore";
import { mergeTrees } from "../../../utils/treeUtils";

export function useWatcherEvents(id: string, refresh: (p?: string) => Promise<void>) {
  const pendingPaths = useRef<Set<string>>(new Set());
  const timer = useRef<any>(null);

  useEffect(() => {
    invoke("watch_project", { id, path: id }).catch(() => {});
    const unFs = listen<string[]>(`fs-change-${id}`, (e) => {
      const paths = (e.payload || []).filter(p => p.startsWith(id));
      if (paths.length === 0) return;
      
      paths.forEach(p => pendingPaths.current.add(p));
      clearTimeout(timer.current);
      timer.current = setTimeout(async () => {
        const currentPaths = Array.from(pendingPaths.current); pendingPaths.current.clear();
        // Strict filtering to ensure we don't refresh above project root
        const dirs = new Set(currentPaths.map(p => {
          const dir = p.split(/[\\/]/).slice(0, -1).join('/') || id;
          return dir.startsWith(id) ? dir : id;
        }));
        
        if (dirs.size > 5) return refresh(id);
        for (const d of dirs) await refresh(d);
      }, 2000); // 2s debounce to be safe
    });

    return () => { clearTimeout(timer.current); unFs.then(f => f()); invoke("unwatch_project", { id }).catch(() => {}); };
  }, [id, refresh]);
}
