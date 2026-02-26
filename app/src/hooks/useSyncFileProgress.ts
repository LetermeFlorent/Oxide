
import { useCallback } from "react";
import { useStore } from "../store/useStore";
import { calculateTaskProgress } from "../utils/mdUtils";

export function useSyncFileProgress() {
  const updateActiveProject = useStore(s => s.updateActiveProject);
  const activeProjectId = useStore(s => s.activeProjectId);
  
  return useCallback((path: string, content: string) => {
    const state = useStore.getState();
    const activeProject = state.projects.find(p => p.id === activeProjectId);
    
    if (activeProject?.followedFilePath === path) {
      updateActiveProject({ taskProgress: calculateTaskProgress(content) });
    }
  }, [activeProjectId, updateActiveProject]);
}
