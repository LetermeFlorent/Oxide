
import { useEffect, useRef } from "react";
import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/core";
import { useStore } from "../../../store/useStore";

export function useWatcherEvents(id: string, refresh: (p?: string) => Promise<void>) {
  const pendingPaths = useRef<Set<string>>(new Set());
  const timer = useRef<any>(null);

  useEffect(() => {
    invoke("watch_project", { id, path: id }).catch(() => {});
    const unFs = listen<string[]>(`fs-change-${id}`, (e) => {
      const paths = (e.payload || []).filter(p => p.startsWith(id));
      if (paths.length === 0) return;
      
      // Strict ignore patterns to prevent infinite loops on system/temp files
      const ignored = ['.git', '.gemini', 'node_modules', '.DS_Store', 'Thumbs.db'];
      const validPaths = paths.filter(p => !ignored.some(i => p.includes(`/${i}/`) || p.endsWith(`/${i}`)));

      if (validPaths.length === 0) return;

      validPaths.forEach(p => pendingPaths.current.add(p));
      clearTimeout(timer.current);
      timer.current = setTimeout(async () => {
        const currentPaths = Array.from(pendingPaths.current); pendingPaths.current.clear();
        
        const dirs = new Set(currentPaths.map(p => {
          const dir = p.split(/[\\/]/).slice(0, -1).join('/') || id;
          return dir.startsWith(id) ? dir : id;
        }));
        
        if (dirs.size > 5) return refresh(id, currentPaths);
        for (const d of dirs) await refresh(d, currentPaths);
      }, 2000);
    });

    return () => { clearTimeout(timer.current); unFs.then(f => f()); invoke("unwatch_project", { id }).catch(() => {}); };
  }, [id, refresh]);
}
