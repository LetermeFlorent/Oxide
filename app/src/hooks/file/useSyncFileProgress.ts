import { useEffect } from "react";
import { useStore } from "../../store/useStore";
import { calculateTaskProgress } from "../../utils/md/mdUtils";

export function useSyncFileProgress() {
  const activeProjectId = useStore(s => s.activeProjectId);
  const activeProject = useStore(s => s.projects.find(p => p.id === activeProjectId));
  const updateActiveProject = useStore(s => s.updateActiveProject);

  useEffect(() => {
    if (!activeProject || !activeProject.selectedFile || !activeProject.followedFilePath) return;

    if (activeProject.selectedFile.path === activeProject.followedFilePath) {
      const progress = calculateTaskProgress(activeProject.fileContent);
      if (progress !== activeProject.taskProgress) {
        updateActiveProject({ taskProgress: progress });
      }
    }
  }, [activeProject?.fileContent, activeProject?.followedFilePath, activeProject?.selectedFile?.path, updateActiveProject]);
}
