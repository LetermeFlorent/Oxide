
import { useState, memo, useCallback } from "react";
import { useStore } from "../../store/useStore";
import { FileEntry } from "../../store/types";
import { TreeItemContent } from "./Explorer/components/TreeItemContent";
import { FileContextMenu } from "./Explorer/components/FileContextMenu";
import { useFolderManagement } from "../../hooks/useFolderManagement";
import { useFileActions, useExplorerState } from "./Explorer/index";
import { monitoredInvoke } from "../../utils/performance";
import { calculateTaskProgress } from "../../utils/mdUtils";

export const TreeItem = memo(({ entry, onClick, level = 0, projectId }: { entry: FileEntry, onClick: (e: FileEntry) => void, level?: number, projectId?: string }) => {
  const [menu, setMenu] = useState<{ x: number, y: number, entry: FileEntry } | null>(null);
  const { scanFolder } = useFolderManagement();
  const activeProjectId = useStore(s => s.activeProjectId);
  const targetId = projectId || activeProjectId;
  const toggleFolder = useStore(s => s.toggleFolder);
  const setFollowedFile = useStore(s => s.setFollowedFile);
  
  const { isOpen, isSelected, isFollowing } = useExplorerState(entry.path, targetId);
  const { onRename, onDelete, onReveal, onCreateFile, onCreateFolder } = useFileActions(targetId);

  const handleToggleFollow = useCallback(async (item: FileEntry) => {
    if (!targetId) return;
    if (isFollowing) {
      setFollowedFile(targetId, null, null);
    } else {
      try {
        const content = await monitoredInvoke<string>("read_text_file", { path: item.path });
        const progress = calculateTaskProgress(content);
        setFollowedFile(targetId, item.path, progress);
      } catch (e) {
        setFollowedFile(targetId, item.path, null);
      }
    }
  }, [targetId, isFollowing, setFollowedFile]);

  const handleAction = useCallback(async (e: any) => {
    e.stopPropagation();
    if (entry.isFolder) {
      if (!isOpen && targetId && !entry.children?.length) await scanFolder(targetId, entry.path);
      toggleFolder(entry.path);
    }
    onClick(entry);
  }, [entry, onClick, toggleFolder, isOpen, targetId, scanFolder]);

  return (
    <>
      <TreeItemContent entry={entry} isOpen={isOpen} isSelected={isSelected} isPdf={entry.name.toLowerCase().endsWith('.pdf')} isFollowing={isFollowing} level={level} handleAction={handleAction} handleContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); setMenu({ x: e.clientX, y: e.clientY, entry }); }} onDoubleClick={(e) => { e.stopPropagation(); onRename(entry); }} />
      {menu && <FileContextMenu menu={menu} onHide={() => setMenu(null)} onRename={() => onRename(menu.entry)} onDelete={() => onDelete(menu.entry)} onReveal={() => onReveal(menu.entry)} onCreateFile={() => onCreateFile(menu.entry)} onCreateFolder={() => onCreateFolder(menu.entry)} isFollowing={isFollowing} onToggleFollow={handleToggleFollow} />}
    </>
  );
});

TreeItem.displayName = 'TreeItem';
