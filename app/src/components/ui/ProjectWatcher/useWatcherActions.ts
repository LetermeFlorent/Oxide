
import { useCallback, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useStore } from "../../../store/useStore";
import { mergeTrees } from "../../../utils/tree/treeMerge";

export function useWatcherActions(id: string) {
  const { updateProjectTree, applyFilePatch } = useStore.getState();
  const isRefreshing = useRef<Record<string, boolean>>({});

  const refresh = useCallback(async (path?: string) => {
    const target = path || id;
    if (isRefreshing.current[target]) return;
    isRefreshing.current[target] = true;
    try {
      if (!path || path === id) {
        const res = await invoke<any>("scan_project", { path: id, recursive: true });
        const p = useStore.getState().projects.find(px => px.id === id);
        if (p) {
          updateProjectTree(id, mergeTrees(p.tree, res.tree));
        } else {
          updateProjectTree(id, res.tree);
        }
        invoke("index_project_db", { path: id }).catch(() => {});
        return;
      }
      // ... rest of logic
    } finally { delete isRefreshing.current[target]; }
  }, [id, updateProjectTree, applyFilePatch]);

  return { refresh };
}
