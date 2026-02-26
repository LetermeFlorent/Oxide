
import { Trash2, Plus } from "lucide-react";
import { useStore } from "../../../store/useStore";
import { memo, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useShallow } from "zustand/react/shallow";
import { OverviewModal } from "../../ui/Modals/OverviewModal";
import { GroupModal } from "./GroupModal";
import { CloseTabsModal } from "./CloseTabsModal";
import { TabContextMenu } from "./TabContextMenu";
import { useProjectTabs } from "./useProjectTabs";
import { UnifiedTabsList } from "./UnifiedTabsList";
import { useProjectTabsReorder } from "./useProjectTabsReorder";

export const ProjectTabs = memo(({ onOpen }: { onOpen: () => void }) => {
  const s = useProjectTabs();
  const tabBarRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { compactMode, verticalTabs, setViewMode, viewMode } = useStore(useShallow(state => ({ compactMode: state.compactMode, verticalTabs: state.verticalTabs, viewMode: state.viewMode, setViewMode: state.setViewMode })));
  const { handleDrag, handleDragEnd, handleReorder } = useProjectTabsReorder(s.allTabs, s.setGlobalTabsOrder, setIsDragging);

  return (
    <div ref={tabBarRef} onWheel={(e) => !verticalTabs && (e.currentTarget.scrollLeft += e.deltaY)} className={`flex shrink-0 select-none transition-colors relative ${isDragging ? 'z-[9999] overflow-visible' : 'z-[1000]'} ${verticalTabs ? 'flex-col gap-1 p-2 w-full h-full overflow-y-auto scrollbar-modern-thin' : `items-center overflow-x-auto scrollbar-modern-thin ${compactMode ? 'gap-0 h-8 border-b border-gray-200 bg-white' : 'gap-1 h-10 pb-1 -mx-1 px-1'}`}`}>
      <AnimatePresence>
        <OverviewModal show={s.showEditOverviewModal} onHide={() => s.setShowEditOverviewModal(false)} title="Configure Grid" label="Manage Terminals" projects={s.projects} selectedIds={s.editingProjectIds} onToggle={(id: string) => s.setEditingProjectIds(prev => prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id])} onConfirm={() => { useStore.getState().setTerminalOverviewProjects(s.editingOverviewId!, s.editingProjectIds); s.setShowEditOverviewModal(false); }} />
        <GroupModal show={s.showGroupModal} onHide={() => s.setShowGroupModal(false)} newGroupName={s.newGroupName} setNewGroupName={s.setNewGroupName} onConfirm={s.handleCreateGroup} />
        <CloseTabsModal show={s.showCloseModal} onHide={() => s.setShowCloseModal(false)} allTabs={s.allTabs} selectedIds={s.selectedCloseIds} onToggle={(id: string) => s.setSelectedCloseIds(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id])} onSelectAll={() => s.setSelectedCloseIds(s.selectedCloseIds.length === s.allTabs.length ? [] : s.allTabs.map(t => t.id))} onConfirm={s.handleCloseSelected} />
      </AnimatePresence>
      <UnifiedTabsList s={s} verticalTabs={verticalTabs} compactMode={compactMode} viewMode={viewMode} onDrag={handleDrag} onDragEnd={handleDragEnd} onReorder={handleReorder} />
      <div className={`flex items-center shrink-0 ${verticalTabs ? 'w-full py-4 border-t border-gray-100 mt-2 justify-center gap-4' : `px-2 ${compactMode ? 'h-full border-l border-gray-200 bg-white' : 'gap-1 ml-1'}`}`}>
        {s.allTabs.length > 2 && <button onClick={() => s.setShowCloseModal(true)} className={`p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all ${verticalTabs ? 'scale-125' : ''}`}><Trash2 size={12} /></button>}
        <button onClick={onOpen} className={`p-1.5 text-gray-400 hover:text-black hover:bg-gray-50 rounded-lg ${verticalTabs ? 'scale-125' : ''}`}><Plus size={12} /></button>
      </div>
      <TabContextMenu menu={s.contextMenu} onHide={() => s.setContextMenu(null)} onRename={(id: string, type: string) => { const it = type === 'overview' ? s.terminalOverviews.find(o => o.id === id) : (type === 'group' ? s.groups.find(g => g.id === id) : s.projects.find(p => p.id === id)); s.setRenamingId(id); s.setTempName(it?.name || ""); s.setContextMenu(null); }} onConfigure={(id: string) => { s.handleOpenEditOverview(id); s.setContextMenu(null); }} onCreateGroup={(id: string) => { s.setPendingItemId(id); s.setShowGroupModal(true); s.setContextMenu(null); }} onMoveToGroup={(id: string, g: string | null, dg: string | null) => { if (dg) s.deleteGroup(dg); else s.moveToGroup(id, g); s.setContextMenu(null); }} onDeleteGroup={(id: string) => { s.deleteGroup(id); s.setContextMenu(null); }} onCloseProject={s.closeProject} onCloseOverview={s.closeTerminalOverview} groups={s.groups} projects={s.projects} terminalOverviews={s.terminalOverviews} />
    </div>
  );
});
ProjectTabs.displayName = 'ProjectTabs';
