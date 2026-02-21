import { useMemo, useCallback } from "react";
import { useStore } from "../../../store/useStore";
import { calculateTaskProgress } from "../../../utils/mdUtils";

export function useContentViewer(content: string, fileName?: string) {
  const activeProjectId = useStore(s => s.activeProjectId);
  const project = useStore(s => s.projects.find(p => p.id === activeProjectId));
  const viewMode = useStore(s => s.viewMode);
  const setViewMode = useStore(s => s.setViewMode);
  const updateActiveProject = useStore(s => s.updateActiveProject);
  const compactMode = useStore(s => s.compactMode);
  
  const isMd = useMemo(() => fileName?.toLowerCase().endsWith('.md') ?? false, [fileName]);
  const isPdf = useMemo(() => fileName?.toLowerCase().endsWith('.pdf') ?? false, [fileName]);
  const isImage = useMemo(() => {
    if (!fileName) return false;
    const lower = fileName.toLowerCase();
    return ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].some(ext => lower.endsWith(ext));
  }, [fileName]);

  const isFollowing = project?.followedFilePath === project?.selectedFile?.path;

  const toggleFollow = useCallback(() => {
    if (!project || !project.selectedFile) return;
    if (isFollowing) updateActiveProject({ followedFilePath: null, taskProgress: null });
    else updateActiveProject({ followedFilePath: project.selectedFile.path, taskProgress: calculateTaskProgress(content) });
  }, [project, isFollowing, content, updateActiveProject]);

  return { viewMode, setViewMode, compactMode, isMd, isPdf, isImage, isFollowing, toggleFollow };
}
