/**
 * @file useFileOperations.ts
 */

import { useCallback, useEffect } from "react";
import { useStore } from "../store/useStore";
import { useFileLoading } from "./useFileLoading";
import { useFileSaving } from "./useFileSaving";
import { monitoredInvoke } from "../utils/performance";
import { treeWorker as worker } from "../utils/treeWorkerInstance";

export function useFileOperations() {
  const activeProjectId = useStore(s => s.activeProjectId);
  const updateProjectTree = useStore(s => s.updateProjectTree);
  const lastDeleted = useStore(s => s.lastDeleted);
  const setLastDeleted = useStore(s => s.setLastDeleted);
  const applyFilePatch = useStore(s => s.applyFilePatch);
  const loadFile = useFileLoading();
  const saveFile = useFileSaving();

  // ... (useEffect remains)

  const onUndo = useCallback(async () => {
    if (!lastDeleted || !activeProjectId || lastDeleted.projectId !== activeProjectId) return;
    try {
      console.log("[Undo] Restoring:", lastDeleted.entry.path);
      if (lastDeleted.entry.isFolder) {
        await monitoredInvoke("create_dir", { path: lastDeleted.entry.path });
      } else {
        await monitoredInvoke("write_text_file", { path: lastDeleted.entry.path, content: lastDeleted.content || "" });
      }
      
      applyFilePatch(activeProjectId, {
        parent_path: lastDeleted.parentPath,
        removed: [],
        added: [lastDeleted.entry]
      });
      setLastDeleted(null);
    } catch (e) { console.error("[Undo] Restore failed:", e); }
  }, [lastDeleted, activeProjectId, applyFilePatch, setLastDeleted]);

  const refreshTree = useCallback(async (id: string) => {
    try {
      const binaryData = await monitoredInvoke<Uint8Array>("scan_project_binary", { path: id, recursive: true });
      worker.postMessage({ type: 'PARSE_BINARY', binaryData }, [binaryData.buffer]);
    } catch (e) { console.error("[FS] Refresh error:", e); }
  }, []);

  const onFile = useCallback(async (f: any) => {
    if (!activeProjectId) return;
    console.log("[onFile] Clicked entry:", f.name, "isFolder:", f.isFolder);
    if (f.isFolder) {
      if (!f.children?.length) {
        const res = await monitoredInvoke<any>("scan_project", { path: f.path, recursive: false });
        f.children = res.tree;
        const currentTree = useStore.getState().projects.find(p => p.id === activeProjectId)?.tree || [];
        updateProjectTree(activeProjectId, [...currentTree]); 
      }
    } else { loadFile(f); }
  }, [activeProjectId, loadFile, updateProjectTree]);

  return { onFile, saveFile, refreshTree, onUndo };
}
