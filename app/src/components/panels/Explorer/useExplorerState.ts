
import { useCallback } from "react";
import { useStore } from "../../../store/useStore";

export function useExplorerState(path: string, projectId: string | null) {
  const norm = (p: string) => p.replace(/\\/g, '/').replace(/\/$/, '');
  const isOpen = useStore(useCallback(s => !!s.expandedFolders[path], [path]));
  
  const isSelected = useStore(useCallback(s => {
    const proj = s.projects.find(p => p.id === projectId);
    return proj?.selectedFile ? norm(proj.selectedFile.path) === norm(path) : false;
  }, [path, projectId]));

  const isFollowing = useStore(useCallback(s => {
    const proj = s.projects.find(p => p.id === projectId);
    return proj?.followedFilePath ? norm(proj.followedFilePath) === norm(path) : false;
  }, [path, projectId]));

  return { isOpen, isSelected, isFollowing };
}
