
import { Terminal, PanelLeft, FolderOpen, Settings, Monitor, Search } from "lucide-react";
import { useStore } from "../../../store/useStore";
import { memo, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { selectActiveOverview } from "../../../store/selectors";
import { IconButton } from "./IconButton";
import { ProgressThermometer } from "./ProgressThermometer";
import { useActivityBarActions } from "./useActivityBarActions";
import { OverviewModal } from "../../ui/Modals/OverviewModal";
import { WindowControls } from "../../ui/WindowControls";
import { t } from "../../../i18n";

export const ActivityBar = memo(({ onOpenFolder }: { onOpenFolder: () => void }) => {
  const showExplorer = useStore(s => s.showExplorer);
  const toggleExplorer = useStore(s => s.toggleExplorer);
  const showSearch = useStore(s => s.showSearch);
  const toggleSearch = useStore(s => s.toggleSearch);
  const showPreview = useStore(s => s.showPreview);
  const togglePreview = useStore(s => s.togglePreview);
  const showSettings = useStore(s => s.showSettings);
  const toggleSettings = useStore(s => s.toggleSettings);
  const activeProjectId = useStore(s => s.activeProjectId);
  const projects = useStore(s => s.projects);
  const showProgressBar = useStore(s => s.showProgressBar);
  const showProgressPercentage = useStore(s => s.showProgressPercentage);
  
  const activeOverview = useStore(selectActiveOverview);
  const hideIcons = !!activeOverview || activeProjectId === 'settings';
  const progress = useMemo(() => projects.find(p => p.id === activeProjectId)?.taskProgress ?? null, [projects, activeProjectId]);
  const { showConfig, setShowConfig, name, setName, selectedIds, toggleProject, handleSelectAll, handleCreate, handleFolderAction } = useActivityBarActions(projects, onOpenFolder);

  return (
    <div data-tauri-drag-region className="w-[60px] flex flex-col items-center py-3 bg-panel-bg shrink-0 z-50 relative overflow-hidden select-none rounded-[12px] shadow-sm">
      <IconButton id="new-overview" icon={Terminal} onClick={() => setShowConfig(true)} active={showConfig} />
      
      {!hideIcons && [
        { id: 'explorer', icon: PanelLeft, onClick: toggleExplorer, active: showExplorer },
        { id: 'preview', icon: Monitor, onClick: togglePreview, active: showPreview, color: "text-blue-500" },
        { id: 'folder', icon: FolderOpen, onClick: () => handleFolderAction(activeProjectId, hideIcons), active: false }
      ].map(btn => (
        <IconButton key={btn.id} id={btn.id} icon={btn.icon} onClick={btn.onClick} active={btn.active} activeColor={btn.color} />
      ))}

      <div className="flex-1" />
      {(showProgressBar || showProgressPercentage) && <ProgressThermometer progress={progress} showBar={showProgressBar} showPercent={showProgressPercentage} />}
      <IconButton id="settings" icon={Settings} onClick={toggleSettings} active={showSettings} />
    </div>
  );
});

ActivityBar.displayName = 'ActivityBar';
