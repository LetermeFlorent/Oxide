
import { useCallback, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";
import { useStore } from "../../../store/useStore";
import { mergeTrees } from "../../../utils/tree/treeMerge";

export function useWatcherActions(id: string) {
  const { updateProjectTree, updateProject } = useStore.getState();
  const isRefreshing = useRef<Record<string, boolean>>({});

  const refresh = useCallback(async (path?: string, changedPaths?: string[]) => {
    const target = path || id;
    if (isRefreshing.current[target]) return;
    isRefreshing.current[target] = true;
    try {
      const p = useStore.getState().projects.find(px => px.id === id);
      if (!p) return;

      // Reload active file content if it was changed externally
      if (changedPaths && p.selectedFile && changedPaths.includes(p.selectedFile.path)) {
        try {
          const content = await invoke<string>("read_text_file", { path: p.selectedFile.path });
          if (content !== null && content !== p.fileContent) {
            updateProject(id, { fileContent: content });
          }
        } catch (e) {
          // Fail silently for binary or inaccessible files
        }
      }

      if (!path || path === id) {
        const res = await invoke<any>("scan_project", { path: id, recursive: true });
        updateProjectTree(id, mergeTrees(p.tree, res.tree));
        invoke("index_project_db", { path: id }).catch(() => {});
        return;
      }
    } finally { delete isRefreshing.current[target]; }
  }, [id, updateProjectTree, updateProject]);

  return { refresh };
}
