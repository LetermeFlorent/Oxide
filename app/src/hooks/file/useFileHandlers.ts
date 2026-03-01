
import { useCallback } from "react";
import { monitoredInvoke } from "../../utils/performance/monitoredInvoke";
import { useStore } from "../../store/useStore";

export function useFileHandlers(activeId: string | null, loadFile: any, updateTree: any) {
  return useCallback(async (f: any) => {
    if (!activeId) return;
    if (f.isFolder) {
      if (!f.children?.length) {
        const res = await monitoredInvoke<any>("scan_project", { path: f.path, recursive: false });
        f.children = res.tree;
        const current = useStore.getState().projects.find(p => p.id === activeId)?.tree || [];
        updateTree(activeId, [...current]); 
      }
    } else { loadFile(f); }
  }, [activeId, loadFile, updateTree]);
}
