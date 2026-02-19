/**
 * @file useFileSaving.ts
 * @description Hook for saving file content to disk with debounce
 */

import { useCallback, useRef } from "react";
import { useStore } from "../store/useStore";
import { calculateTaskProgress } from "../utils/mdUtils";
import { monitoredInvoke } from "../utils/performance";

export function useFileSaving() {
  const activeProjectId = useStore(s => s.activeProjectId);
  const activeProject = useStore(s => s.projects.find(p => p.id === activeProjectId));
  const updateActiveProject = useStore(s => s.updateActiveProject);
  const timeoutRef = useRef<any>(null);

  return useCallback(async (content: string) => {
    if (!activeProject?.selectedFile?.path) return;
    updateActiveProject({ fileContent: content });
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      try {
        await monitoredInvoke("write_text_file", { path: activeProject.selectedFile!.path, content });
        if (activeProject.followedFilePath === activeProject.selectedFile!.path) {
          updateActiveProject({ taskProgress: calculateTaskProgress(content) });
        }
      } catch (e) { console.error("[FS] Save error:", e); }
    }, 500);
  }, [activeProject, updateActiveProject]);
}
