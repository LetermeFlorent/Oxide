
import { useCallback } from "react";
import { useStore } from "../store/useStore";
import { useFileLoading, useFileSaving, useUndoOperations, useFileHandlers } from "./index";
import { monitoredInvoke } from "../utils/performance";
import { treeWorker as worker } from "../utils/treeWorkerInstance";

export function useFileOperations() {
  const s = useStore();
  const onUndo = useUndoOperations(s.lastDeleted, s.activeProjectId, s.applyFilePatch, s.setLastDeleted);
  const onFile = useFileHandlers(s.activeProjectId, useFileLoading(), s.updateProjectTree);

  const refreshTree = useCallback(async (id: string) => {
    try {
      useStore.getState().updateProject(id, { isLoading: true });
      const res = await monitoredInvoke<any>("scan_project", { path: id, recursive: true });
      // Use the existing tree for merging instead of clearing it
      const currentTree = useStore.getState().projects.find(p => p.id === id)?.tree || [];
      const { mergeTrees } = await import("../utils/treeUtils");
      useStore.getState().updateProjectTree(id, mergeTrees(currentTree, res.tree));
    } catch (e) { 
      
      useStore.getState().updateProject(id, { isLoading: false });
    }
  }, []);

  return { onFile, saveFile: useFileSaving(), refreshTree, onUndo };
}
