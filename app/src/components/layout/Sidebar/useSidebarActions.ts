
import { useCallback, useState } from "react";
import { useStore } from "../../../store/useStore";
import { monitoredInvoke } from "../../../utils/performance";

export function useSidebarActions(activeProject: any) {
  const [isIndexing, setIsIndexing] = useState(false);
  const { updateProjectTree, applyFilePatch, setFolderExpanded, setExplorerModal } = useStore.getState();

  const handleReindex = useCallback(async () => {
    if (!activeProject || isIndexing) return;
    setIsIndexing(true);
    const updateProject = useStore.getState().updateProject;
    updateProject(activeProject.id, { isLoading: true });
    try {
      const res = await monitoredInvoke<any>("scan_project", { path: activeProject.id, recursive: true });
      updateProjectTree(activeProject.id, res.tree);
      await monitoredInvoke("index_project_lsm", { path: activeProject.id });
    } catch (e) {
      
      updateProject(activeProject.id, { isLoading: false });
    } finally { setIsIndexing(false); }
  }, [activeProject, isIndexing, updateProjectTree]);

  const handleExplorerConfirm = useCallback(async (name: string, explorerModal: any) => {
    if (!explorerModal || !activeProject) return;
    const { type, target } = explorerModal;
    let parentDir = activeProject.id;
    if (target) {
      parentDir = target.isFolder ? target.path : target.path.substring(0, Math.max(0, target.path.lastIndexOf('/')));
    }
    const fullPath = `${parentDir}/${name}`.replace(/\/+/g, '/');
    try {
      if (type === 'file') await monitoredInvoke("write_text_file", { path: fullPath, content: "" });
      else await monitoredInvoke("create_dir", { path: fullPath });
      applyFilePatch(activeProject.id, { parent_path: parentDir, removed: [], added: [{ name, path: fullPath, isFolder: type === 'folder', children: type === 'folder' ? [] : null }] });
      if (parentDir) setFolderExpanded(parentDir, true);
      setExplorerModal(null);
    } catch (err) {  alert(`Create ${type} failed: ` + err); }
  }, [activeProject, applyFilePatch, setFolderExpanded, setExplorerModal]);

  return { isIndexing, handleReindex, handleExplorerConfirm };
}
