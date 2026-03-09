
import { memo } from "react";
import { useStore } from "../../store/useStore";
import { ConfirmModal } from "./ConfirmModal";
import { PromptModal } from "./PromptModal";
import { SettingsModal } from "./Modals/SettingsModal";
import { ColorPickerModal } from "./Modals/ColorPickerModal";
import { TabContextMenu } from "../layout/ProjectTabs/TabContextMenu";
import { OverviewModal } from "./Modals/OverviewModal";
import { useActivityBarActions } from "../layout/ActivityBar/useActivityBarActions";
import { t } from "../../i18n";

export const GlobalModals = memo(() => {
  const confirmModal = useStore(s => s.confirmModal);
  const setConfirmModal = useStore(s => s.setConfirmModal);
  const promptModal = useStore(s => s.promptModal);
  const setPromptModal = useStore(s => s.setPromptModal);
  const contextMenu = useStore(s => s.contextMenu);
  const setContextMenu = useStore(s => s.setContextMenu);
  const s = useStore();

  // Logic for the New Overview modal (moved from ActivityBar)
  const { showConfig, setShowConfig, name, setName, selectedIds, toggleProject, handleSelectAll, handleCreate } = useActivityBarActions(s.projects, () => {});

  return (
    <>
      <SettingsModal />
      <ColorPickerModal />
      <OverviewModal 
        show={showConfig} 
        onHide={() => setShowConfig(false)} 
        title={t('overview.new')} 
        label={t('overview.title')} 
        projects={s.projects} 
        selectedIds={selectedIds} 
        onToggle={toggleProject} 
        onConfirm={handleCreate} 
        name={name} 
        setName={setName} 
        onSelectAll={handleSelectAll} 
      />
      <ConfirmModal 
        show={!!confirmModal?.show} title={confirmModal?.title || ""} message={confirmModal?.message || ""} 
        kind={confirmModal?.kind} onHide={() => setConfirmModal(null)} onConfirm={confirmModal?.onConfirm || (() => {})} 
      />
      <PromptModal 
        show={!!promptModal?.show} title={promptModal?.title || ""} label={promptModal?.label || ""} 
        defaultValue={promptModal?.defaultValue || ""} onHide={() => setPromptModal(null)} 
        onConfirm={(val: string) => { if (promptModal?.onConfirm) promptModal.onConfirm(val); setPromptModal(null); }} 
      />
      <TabContextMenu 
        menu={contextMenu} 
        onHide={() => setContextMenu(null)} 
        onRename={(id: string, type: string) => { 
          const it = type === 'overview' ? s.terminalOverviews.find(o => o.id === id) : (type === 'group' ? s.groups.find(g => g.id === id) : s.projects.find(p => p.id === id)); 
          s.setRenamingId(id); 
          s.setTempName(it?.name || ""); 
          setContextMenu(null); 
        }} 
        onConfigure={(id: string) => { 
          // Note: Configuration modal logic would need to be moved to store if we want it here
        }}
        onCreateGroup={(id: string) => {
          s.setPendingItemId(id);
          s.setShowGroupModal(true);
          setContextMenu(null);
        }}
        onMoveToGroup={(id: string, g: string | null) => { s.moveToGroup(id, g); setContextMenu(null); }}
        onDeleteGroup={(id: string) => { s.deleteGroup(id); setContextMenu(null); }}
        onCloseProject={s.closeProject}
        onCloseOverview={s.closeTerminalOverview}
        groups={s.groups}
        projects={s.projects}
        terminalOverviews={s.terminalOverviews}
        setColorModal={s.setColorModal}
        setShowGroupModal={s.setShowGroupModal}
        setPendingItemId={s.setPendingItemId}
      />
    </>
  );
});

GlobalModals.displayName = 'GlobalModals';
