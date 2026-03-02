
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
  const { showExplorer, toggleExplorer, showSearch, toggleSearch, showPreview, togglePreview, showSettings, toggleSettings, activeProjectId, projects, compactMode, showProgressBar, showProgressPercentage } = useStore();
  const activeOverview = useStore(selectActiveOverview);
  const hideIcons = !!activeOverview || activeProjectId === 'settings';
  const progress = useMemo(() => projects.find(p => p.id === activeProjectId)?.taskProgress ?? null, [projects, activeProjectId]);
  const { showConfig, setShowConfig, name, setName, selectedIds, toggleProject, handleSelectAll, handleCreate, handleFolderAction } = useActivityBarActions(projects, onOpenFolder);

  return (
    <div data-tauri-drag-region className={`w-12 flex flex-col items-center pt-4 pb-1 bg-white shrink-0 z-50 relative overflow-hidden select-none ${compactMode ? 'border-r border-gray-200' : 'rounded-xl border border-gray-100'}`}>
      <IconButton id="new-overview" icon={Terminal} onClick={() => setShowConfig(true)} active={showConfig} />
      
      {!hideIcons && [
        { id: 'explorer', icon: PanelLeft, onClick: toggleExplorer, active: showExplorer },
        { id: 'preview', icon: Monitor, onClick: togglePreview, active: showPreview, color: "text-blue-500" },
        { id: 'folder', icon: FolderOpen, onClick: () => handleFolderAction(activeProjectId, hideIcons), active: false }
      ].map(btn => (
        <IconButton key={btn.id} id={btn.id} icon={btn.icon} onClick={btn.onClick} active={btn.active} activeColor={btn.color} />
      ))}

      <OverviewModal 
        show={showConfig} 
        onHide={() => setShowConfig(false)} 
        title={t('overview.new')} 
        label={t('overview.title')} 
        projects={projects} 
        selectedIds={selectedIds} 
        onToggle={toggleProject} 
        onConfirm={handleCreate} 
        name={name} 
        setName={setName} 
        onSelectAll={handleSelectAll} 
      />
      <div className="flex-1" />
      {(showProgressBar || showProgressPercentage) && <ProgressThermometer progress={progress} showBar={showProgressBar} showPercent={showProgressPercentage} />}
      <IconButton id="settings" icon={Settings} onClick={toggleSettings} active={showSettings} />
    </div>
  );
});

ActivityBar.displayName = 'ActivityBar';
