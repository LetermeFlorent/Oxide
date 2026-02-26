/**
 * @file useFileSaving.ts
 * @description Hook for saving file content to disk with debounce
 */

import { useCallback, useRef } from "react";
import { useStore } from "../store/useStore";
import { useSyncFileProgress } from "./useSyncFileProgress";
import { useOxideCommand } from "./useOxideCommand";

export function useFileSaving() {
  const activeProjectId = useStore(s => s.activeProjectId);
  const activeProject = useStore(s => s.projects.find(p => p.id === activeProjectId));
  const updateActiveProject = useStore(s => s.updateActiveProject);
  const syncProgress = useSyncFileProgress();
  const execute = useOxideCommand();
  const timeoutRef = useRef<any>(null);

  return useCallback(async (content: string) => {
    const path = activeProject?.selectedFile?.path;
    if (!path) return;
    
    updateActiveProject({ fileContent: content });
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    timeoutRef.current = setTimeout(async () => {
      const success = await execute("write_text_file", { path, content });
      if (success !== null) syncProgress(path, content);
    }, 500);
  }, [activeProject, updateActiveProject, syncProgress, execute]);
}
