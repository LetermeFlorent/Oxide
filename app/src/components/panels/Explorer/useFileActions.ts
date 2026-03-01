
import { useCallback } from "react";
import { useStore } from "../../../store/useStore";
import { FileEntry } from "../../../store/config/types";
import { monitoredInvoke } from "../../../utils/performance/monitoredInvoke";
import { revealItemInDir } from "@tauri-apps/plugin-opener";
import { t } from "../../../i18n";

export function useFileActions(projectId: string | null) {
  const { applyFilePatch, setLastDeleted, setConfirmModal, setPromptModal, setExplorerModal } = useStore.getState();

  const onRename = useCallback((target: FileEntry) => {
    const type = target.isFolder ? t('explorer.folder') : t('explorer.file');
    setPromptModal({
      show: true, title: t('common.rename'), label: t('explorer.rename_to', { type, name: target.name }), defaultValue: target.name,
      onConfirm: async (newName) => {
        if (!newName || newName.trim() === target.name || !projectId) return;
        try {
          const newPath = await monitoredInvoke<string>("rename_entry", { path: target.path, new_name: newName.trim() });
          const lastSlash = target.path.lastIndexOf('/');
          const parent = lastSlash === -1 ? "" : target.path.substring(0, lastSlash);
          applyFilePatch(projectId, { parent_path: parent || target.path, removed: [target.path], added: [{ ...target, name: newName.trim(), path: newPath }] });
        } catch (err) { alert(`${t('explorer.rename_failed')}: ` + err); }
      }
    });
  }, [projectId, applyFilePatch, setPromptModal]);

  const onDelete = useCallback((target: FileEntry) => {
    const type = target.isFolder ? t('explorer.folder') : t('explorer.file');
    setConfirmModal({
      show: true, title: target.isFolder ? t('explorer.delete_folder') : t('explorer.delete_file'),
      message: t('explorer.confirm_delete', { type, name: target.name }), kind: 'danger',
      onConfirm: async () => {
        if (!projectId) return;
        try {
          const lastSlash = target.path.lastIndexOf('/');
          const parent = lastSlash === -1 ? "" : target.path.substring(0, lastSlash);
          let content = ""; if (!target.isFolder) try { content = await monitoredInvoke<string>("read_text_file", { path: target.path }); } catch {}
          setLastDeleted({ entry: target, projectId, parentPath: parent || target.path, content });
          await monitoredInvoke("delete_entry", { path: target.path });
          applyFilePatch(projectId, { parent_path: parent || target.path, removed: [target.path], added: [] });
        } catch (err) { alert(`${t('explorer.delete_failed')}: ` + err); }
      }
    });
  }, [projectId, applyFilePatch, setLastDeleted, setConfirmModal]);

  return { onRename, onDelete, onReveal: (t: FileEntry) => revealItemInDir(t.path).catch(() => {}), onCreateFile: (target: FileEntry) => setExplorerModal({ show: true, type: 'file', target }), onCreateFolder: (target: FileEntry) => setExplorerModal({ show: true, type: 'folder', target }) };
}
