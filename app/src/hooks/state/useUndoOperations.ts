
import { useCallback } from "react";
import { monitoredInvoke } from "../../utils/performance/monitoredInvoke";

export function useUndoOperations(lastDeleted: any, activeId: string | null, applyPatch: any, setLast: any) {
  return useCallback(async () => {
    if (!lastDeleted || !activeId || lastDeleted.projectId !== activeId) return;
    try {
      if (lastDeleted.entry.isFolder) await monitoredInvoke("create_dir", { path: lastDeleted.entry.path });
      else await monitoredInvoke("write_text_file", { path: lastDeleted.entry.path, content: lastDeleted.content || "" });
      applyPatch(activeId, { parent_path: lastDeleted.parentPath, removed: [], added: [lastDeleted.entry] });
      setLast(null);
    } catch (e) {  }
  }, [lastDeleted, activeId, applyPatch, setLast]);
}
