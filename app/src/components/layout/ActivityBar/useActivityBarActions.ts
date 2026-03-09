
import { useCallback, useState, useEffect } from "react";
import { useStore } from "../../../store/useStore";
import { revealItemInDir as revealExplorer } from "@tauri-apps/plugin-opener";
import { t } from "../../../i18n";

export function useActivityBarActions(projects: any[], onOpenFolder: () => void) {
  const showConfig = useStore(s => s.showOverviewModal);
  const setShowConfig = useStore(s => s.toggleOverviewModal);
  const [name, setName] = useState(t('overview.title'));
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const addTerminalOverview = useStore(s => s.addTerminalOverview);

  useEffect(() => {
    if (showConfig) {
      setSelectedIds(projects.map(p => p.id));
      setName(projects.length > 0 ? "" : t('overview.default_name'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showConfig]);

  const toggleProject = (id: string) => setSelectedIds(prev => prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]);
  const handleSelectAll = () => setSelectedIds(selectedIds.length === projects.length ? [] : projects.map(p => p.id));
  
  const handleCreate = () => {
    if (name.trim() && selectedIds.length) {
      addTerminalOverview(name.trim(), selectedIds);
      setShowConfig(false);
    }
  };

  return { showConfig, setShowConfig, name, setName, selectedIds, toggleProject, handleSelectAll, handleCreate, handleFolderAction: async (activeId: string | null, hideIcons: boolean) => {
    if (activeId && activeId !== 'settings' && !hideIcons) {
      try { await revealExplorer(activeId); } catch (err) {  }
    } else { onOpenFolder(); }
  } };
}
