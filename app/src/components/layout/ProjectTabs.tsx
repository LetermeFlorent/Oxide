/**
 * Project: Oxide App
 * Responsibility: Tab Orchestrator Component
 * License: O.A.S - MS-RSL (Microsoft Reference Source License)
 * Copyright (c) 2026 O.A.S (Optimization & Quality). All rights reserved.
 */
import { Trash2, Plus } from "lucide-react";
import { useStore } from "../../store/useStore";
import { memo } from "react";
import { AnimatePresence } from "framer-motion";
import { TabItem } from "./ProjectTabs/TabItem";
import { EditOverviewModal } from "./ProjectTabs/EditOverviewModal";
import { GroupModal } from "./ProjectTabs/GroupModal";
import { CloseTabsModal } from "./ProjectTabs/CloseTabsModal";
import { TabContextMenu } from "./ProjectTabs/TabContextMenu";
import { useProjectTabs } from "./ProjectTabs/useProjectTabs";
import { useShallow } from "zustand/react/shallow";
import { GroupItem } from "./ProjectTabs/GroupItem";

export const ProjectTabs = memo(({ onOpen }: { onOpen: () => void }) => {
  const s = useProjectTabs();
  const { compactMode, verticalTabs, showSettings } = useStore(useShallow(state => ({ compactMode: state.compactMode, verticalTabs: state.verticalTabs, showSettings: state.showSettings })));
  const containerClass = `flex shrink-0 select-none ${verticalTabs ? 'flex-col gap-1 p-2 w-full h-full overflow-y-auto scrollbar-modern-thin' : `items-center overflow-x-auto scrollbar-modern-thin ${compactMode ? 'gap-0 h-8 border-b border-gray-200 bg-white' : 'gap-1 h-10 pb-1 -mx-1 px-1'}`}`;
  return (
    <div onWheel={(e) => !verticalTabs && (e.currentTarget.scrollLeft += e.deltaY)} className={containerClass}>
      <AnimatePresence>
        <EditOverviewModal show={s.showEditOverviewModal} onHide={() => s.setShowEditOverviewModal(false)} projects={s.projects} editingProjectIds={s.editingProjectIds} toggleProject={(id: string) => s.setEditingProjectIds(prev => prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id])} onConfirm={() => { useStore.getState().setTerminalOverviewProjects(s.editingOverviewId!, s.editingProjectIds); s.setShowEditOverviewModal(false); }} />
        <GroupModal show={s.showGroupModal} onHide={() => s.setShowGroupModal(false)} newGroupName={s.newGroupName} setNewGroupName={s.setNewGroupName} onConfirm={s.handleCreateGroup} />
        <CloseTabsModal show={s.showCloseModal} onHide={() => s.setShowCloseModal(false)} allTabs={s.allTabs} selectedIds={s.selectedCloseIds} onToggle={(id: string) => s.setSelectedCloseIds(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id])} onSelectAll={() => s.setSelectedCloseIds(s.selectedCloseIds.length === s.allTabs.length ? [] : s.allTabs.map(t => t.id))} onConfirm={s.handleCloseSelected} />
      </AnimatePresence>
      {s.groups.map((group, gIdx) => <GroupItem key={group.id || `g-${gIdx}`} group={group} gp={s.projects.filter(p => p.id && p.groupId === group.id)} go={s.terminalOverviews.filter(o => o.groupId === group.id)} active={s.activeProjectId === group.id || s.projects.filter(p => p.id && p.groupId === group.id).some(p => p.id === s.activeProjectId)} compactMode={compactMode} verticalTabs={verticalTabs} s={s} />)}
      {s.terminalOverviews.filter(o => !o.groupId && !!o.id).map(o => <TabItem key={`ov-${o.id}`} id={o.id} type="overview" active={s.activeProjectId === o.id} compactMode={compactMode} onClick={s.switchProject} onClose={s.closeTerminalOverview} onContextMenu={(e: any, id: string, type: any) => s.setContextMenu({ x: e.clientX, y: e.clientY, itemId: id, groupId: null, type })} renamingId={s.renamingId} tempName={s.tempName} setTempName={s.setTempName} submitRename={s.submitRename} vertical={verticalTabs} />)}
      {s.projects.filter(p => !p.groupId && !!p.id).map(p => <TabItem key={`pj-${p.id}`} id={p.id} type="project" active={s.activeProjectId === p.id} compactMode={compactMode} onClick={s.switchProject} onClose={s.closeProject} onContextMenu={(e: any, id: string, type: any) => s.setContextMenu({ x: e.clientX, y: e.clientY, itemId: id, groupId: null, type })} renamingId={s.renamingId} tempName={s.tempName} setTempName={s.setTempName} submitRename={s.submitRename} vertical={verticalTabs} />)}
      {showSettings && <TabItem key="settings" id="settings" type="settings" active={s.activeProjectId === 'settings'} compactMode={compactMode} onClick={s.switchProject} onClose={() => useStore.getState().toggleSettings(false)} onContextMenu={(e: any) => e.preventDefault()} vertical={verticalTabs} />}
      <div className={`flex items-center shrink-0 ${verticalTabs ? 'w-full py-4 border-t border-gray-100 mt-2 justify-center gap-4' : `px-2 ${compactMode ? 'h-full border-l border-gray-200 bg-white' : 'gap-1 ml-1'}`}`}>
        {s.allTabs.length > 2 && <button onClick={() => s.setShowCloseModal(true)} className={`p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all ${verticalTabs ? 'scale-125' : ''}`}><Trash2 size={12} /></button>}
        <button onClick={onOpen} className={`p-1.5 text-gray-400 hover:text-black hover:bg-gray-50 rounded-lg ${verticalTabs ? 'scale-125' : ''}`}><Plus size={12} /></button>
      </div>
      <TabContextMenu menu={s.contextMenu} onHide={() => s.setContextMenu(null)} onRename={(id: any, type: any) => { const it = type === 'overview' ? s.terminalOverviews.find(o => o.id === id) : s.projects.find(p => p.id === id); s.setRenamingId(id); s.setTempName(it?.name || ""); s.setContextMenu(null); }} onConfigure={(id: any) => { s.handleOpenEditOverview(id); s.setContextMenu(null); }} onCreateGroup={(id: any) => { s.setPendingItemId(id); s.setShowGroupModal(true); s.setContextMenu(null); }} onMoveToGroup={(id: any, g: any, dg: any) => { if (dg) s.deleteGroup(dg); else s.moveToGroup(id, g); s.setContextMenu(null); }} groups={s.groups} projects={s.projects} terminalOverviews={s.terminalOverviews} />
    </div>
  );
});
ProjectTabs.displayName = 'ProjectTabs';
