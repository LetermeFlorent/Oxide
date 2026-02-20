import { useState, memo, useCallback } from "react";
import { useStore } from "../../store/useStore";
import { FileEntry } from "../../store/types";
import { TreeItemContent } from "./Explorer/TreeItemContent";
import { useFolderManagement } from "../../hooks/useFolderManagement";
import { FileContextMenu } from "./Explorer/FileContextMenu";
import { revealItemInDir } from "@tauri-apps/plugin-opener";
import { monitoredInvoke } from "../../utils/performance";

import { t } from "../../i18n";

export const TreeItem = memo(({ entry, onClick, level = 0 }: { entry: FileEntry, onClick: (e: FileEntry) => void, level?: number }) => {
  const [menu, setMenu] = useState<{ x: number, y: number, entry: FileEntry } | null>(null);
  const { scanFolder } = useFolderManagement();
  
  const activeProjectId = useStore(s => s.activeProjectId);
  const toggleFolder = useStore(s => s.toggleFolder);
  const applyFilePatch = useStore(s => s.applyFilePatch);
  const setLastDeleted = useStore(s => s.setLastDeleted);
  const setExplorerModal = useStore(s => s.setExplorerModal);
  const setConfirmModal = useStore(s => s.setConfirmModal);
  const setPromptModal = useStore(s => s.setPromptModal);
  
  const isOpen = useStore(useCallback(s => !!s.expandedFolders[entry.path], [entry.path]));
  const isSelected = useStore(useCallback(s => {
    const proj = s.projects.find(p => p.id === s.activeProjectId);
    if (!proj?.selectedFile) return false;
    
    // Normalize path separators and remove trailing slash
    const norm1 = proj.selectedFile.path.replace(/\\/g, '/').replace(/\/$/, '');
    const norm2 = entry.path.replace(/\\/g, '/').replace(/\/$/, '');
    const selected = norm1 === norm2;
    
    if (!entry.name && selected) console.log("[Explorer] Empty-named file matched selected:", norm2);
    return selected;
  }, [entry.path, entry.name]));

  const isFollowing = useStore(useCallback(s => {
    const proj = s.projects.find(p => p.id === s.activeProjectId);
    if (!proj?.followedFilePath) return false;
    const norm1 = proj.followedFilePath.replace(/\\/g, '/').replace(/\/$/, '');
    const norm2 = entry.path.replace(/\\/g, '/').replace(/\/$/, '');
    return norm1 === norm2;
  }, [entry.path]));

  const isPdf = entry.name.toLowerCase().endsWith('.pdf');

  const handleAction = useCallback(async (e: any) => {
    e.stopPropagation();
    if (entry.isFolder) {
      if (!isOpen && activeProjectId && (!entry.children?.length)) await scanFolder(activeProjectId, entry.path);
      toggleFolder(entry.path);
    }
    onClick(entry);
  }, [entry, onClick, toggleFolder, isOpen, activeProjectId, scanFolder]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMenu({ x: e.clientX, y: e.clientY, entry });
  }, [entry]);

  const onRename = useCallback(async (target: FileEntry) => {
    setPromptModal({
      show: true,
      title: "Rename",
      label: `Rename ${target.isFolder ? 'folder' : 'file'} "${target.name}" to:`,
      defaultValue: target.name,
      onConfirm: async (newName) => {
        if (!newName || newName.trim() === target.name || !activeProjectId) return;
        const cleanName = newName.trim();
        try {
          const newPath = await monitoredInvoke<string>("rename_entry", { path: target.path, new_name: cleanName });
          const lastSlash = target.path.lastIndexOf('/');
          const parentPath = lastSlash === -1 ? "" : target.path.substring(0, lastSlash);
          applyFilePatch(activeProjectId, { 
            parent_path: parentPath || target.path, 
            removed: [target.path], 
            added: [{ ...target, name: cleanName, path: newPath }] 
          });
        } catch (err) {
          console.error("Rename failed:", err);
          alert("Rename failed: " + err);
        }
      }
    });
  }, [activeProjectId, applyFilePatch, setPromptModal]);

  const onCreateFile = useCallback((target: FileEntry) => setExplorerModal({ show: true, type: 'file', target }), [setExplorerModal]);
  const onCreateFolder = useCallback((target: FileEntry) => setExplorerModal({ show: true, type: 'folder', target }), [setExplorerModal]);

  const onDelete = useCallback(async (target: FileEntry) => {
    const type = target.isFolder ? (t('explorer.folder') || 'folder') : (t('explorer.file') || 'file');
    const message = t('explorer.confirm_delete', { type, name: target.name }) || `Are you sure you want to delete ${type} "${target.name}"? This action cannot be undone.`;
    
    setConfirmModal({
      show: true,
      title: target.isFolder ? "Delete Folder" : "Delete File",
      message,
      kind: 'danger',
      onConfirm: async () => {
        if (!activeProjectId) return;
        try {
          const lastSlash = target.path.lastIndexOf('/');
          const parentPath = lastSlash === -1 ? "" : target.path.substring(0, lastSlash);
          
          let content = "";
          if (!target.isFolder) {
            try { content = await monitoredInvoke<string>("read_text_file", { path: target.path }); } catch {}
          }
          setLastDeleted({ entry: target, projectId: activeProjectId, parentPath: parentPath || target.path, content });
          
          await monitoredInvoke("delete_entry", { path: target.path });
          applyFilePatch(activeProjectId, { 
            parent_path: parentPath || target.path, 
            removed: [target.path], 
            added: [] 
          });
        } catch (err) {
          console.error("Delete failed:", err);
          alert("Delete failed: " + err);
        }
      }
    });
  }, [activeProjectId, applyFilePatch, setLastDeleted, setConfirmModal]);

  const onReveal = useCallback(async (target: FileEntry) => {
    try {
      await revealItemInDir(target.path);
    } catch (err) {
      console.error("Reveal failed:", err);
    }
  }, []);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onRename(entry);
  }, [entry, onRename]);

  return (
    <>
      <TreeItemContent 
        entry={entry} 
        isOpen={isOpen} 
        isSelected={isSelected} 
        isPdf={isPdf} 
        isFollowing={isFollowing} 
        level={level} 
        handleAction={handleAction} 
        handleContextMenu={handleContextMenu}
        onDoubleClick={handleDoubleClick}
      />
      {menu && (
        <FileContextMenu 
          menu={menu} 
          onHide={() => setMenu(null)} 
          onRename={onRename} 
          onDelete={onDelete} 
          onReveal={onReveal} 
          onCreateFile={onCreateFile}
          onCreateFolder={onCreateFolder}
        />
      )}
    </>
  );
});

TreeItem.displayName = 'TreeItem';
