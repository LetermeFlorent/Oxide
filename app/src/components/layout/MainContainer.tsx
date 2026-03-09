
import { useStore } from "../../store/useStore";
import { ProjectTabs } from "./ProjectTabs";
import { MainLayout } from "./MainLayout";
import { GlobalModals } from "../ui/GlobalModals";
import { PerformanceOverlay } from "../ui/PerformanceOverlay";
import { WindowControls } from "../ui/WindowControls";
import { useFolderManagement } from "../../hooks/file/useFolderManagement";
import { AnimatePresence } from "framer-motion";
import { useProjectTabs } from "./ProjectTabs/useProjectTabs";
import { OverviewModal } from "../ui/Modals/OverviewModal";
import { GroupModal } from "./ProjectTabs/GroupModal";
import { CloseTabsModal } from "./ProjectTabs/CloseTabsModal";

interface MainContainerProps { appReady: boolean; onFile: (path: string, content: string) => void; }

export const MainContainer = ({ appReady, onFile }: MainContainerProps) => {
  const { openFolder } = useFolderManagement();
  const verticalTabs = useStore(s => s.verticalTabs);
  const projects = useStore(s => s.projects);
  const groups = useStore(s => s.groups);
  const terminalOverviews = useStore(s => s.terminalOverviews);
  const showSettings = useStore(s => s.showSettings);
  const showTabs = !verticalTabs && (projects.length > 0 || groups.length > 0 || terminalOverviews.length > 0 || !!showSettings);
  
  const s = useProjectTabs();

  return (
    <div data-tauri-drag-region className={`h-screen w-screen bg-background overflow-hidden flex flex-col select-none transition-opacity duration-500 ${appReady ? 'opacity-100' : 'opacity-0'}`} style={{ cursor: 'default' }}>
      <AnimatePresence mode="wait">
        {s.showEditOverviewModal && <OverviewModal show={s.showEditOverviewModal} onHide={() => s.setShowEditOverviewModal(false)} title="Configure Grid" label="Manage Terminals" projects={s.projects} selectedIds={s.editingProjectIds} onToggle={(id: string) => s.setEditingProjectIds(prev => prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id])} onConfirm={() => { useStore.getState().setTerminalOverviewProjects(s.editingOverviewId!, s.editingProjectIds); s.setShowEditOverviewModal(false); }} />}
        {s.showGroupModal && <GroupModal show={s.showGroupModal} onHide={() => s.setShowGroupModal(false)} newGroupName={s.newGroupName} setNewGroupName={s.setNewGroupName} onConfirm={s.handleCreateGroup} />}
        {s.showCloseModal && <CloseTabsModal show={s.showCloseModal} onHide={() => s.setShowCloseModal(false)} allTabs={s.allTabs} selectedIds={s.selectedCloseIds} onToggle={(id: string) => s.setSelectedCloseIds(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id])} onSelectAll={() => s.setSelectedCloseIds(s.selectedCloseIds.length === s.allTabs.length ? [] : s.allTabs.map(t => t.id))} onConfirm={s.handleCloseSelected} />}
      </AnimatePresence>

      <div className={`flex shrink-0 px-3 relative z-10 transition-all ${verticalTabs ? 'h-6 mt-1' : 'h-10 mt-2'}`} data-tauri-drag-region>
        <div className="flex-1 flex overflow-hidden min-w-0" data-tauri-drag-region>
          {showTabs && <ProjectTabs onOpen={() => openFolder('add')} sharedState={s} />}
        </div>
        <WindowControls />
      </div>
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden" style={{ padding: verticalTabs ? '0 0 4px 0' : '2px 0 4px 0', gap: '0' }}>
        <MainLayout onOpen={() => openFolder('add')} onOpenFolder={() => openFolder('replace')} onFile={onFile} />
      </div>
      <GlobalModals />
      <PerformanceOverlay />
    </div>
  );
};
