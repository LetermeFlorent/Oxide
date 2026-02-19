import { Trash2, Plus, ChevronRight, ChevronDown } from "lucide-react";
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

export const ProjectTabs = memo(({ onOpen }: { onOpen: () => void }) => {
  const s = useProjectTabs();
  const { compactMode, verticalTabs } = useStore(useShallow(state => ({
    compactMode: state.compactMode,
    verticalTabs: state.verticalTabs
  })));
  
  return (
    <div onWheel={(e) => !verticalTabs && (e.currentTarget.scrollLeft += e.deltaY)} className={`flex shrink-0 select-none ${verticalTabs ? 'flex-col gap-1 p-2 w-full h-full overflow-y-auto scrollbar-modern-thin' : `items-center overflow-x-auto scrollbar-modern-thin ${compactMode ? 'gap-0 h-8 border-b border-gray-200 bg-white' : 'gap-1 h-10 pb-1 -mx-1 px-1'}`}`}>
      <AnimatePresence>
        <EditOverviewModal show={s.showEditOverviewModal} onHide={() => s.setShowEditOverviewModal(false)} projects={s.projects} editingProjectIds={s.editingProjectIds} toggleProject={(id: string) => s.setEditingProjectIds(prev => prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id])} onConfirm={() => { useStore.getState().setTerminalOverviewProjects(s.editingOverviewId!, s.editingProjectIds); s.setShowEditOverviewModal(false); }} />
        <GroupModal show={s.showGroupModal} onHide={() => s.setShowGroupModal(false)} newGroupName={s.newGroupName} setNewGroupName={s.setNewGroupName} onConfirm={s.handleCreateGroup} />
        <CloseTabsModal show={s.showCloseModal} onHide={() => s.setShowCloseModal(false)} allTabs={s.allTabs} selectedIds={s.selectedCloseIds} onToggle={(id: string) => s.setSelectedCloseIds(p => p.includes(id) ? p.filter(i => i !== id) : [...p, id])} onSelectAll={() => s.setSelectedCloseIds(s.selectedCloseIds.length === s.allTabs.length ? [] : s.allTabs.map(t => t.id))} onConfirm={s.handleCloseSelected} />
      </AnimatePresence>
      {s.groups.map((group, gIdx) => {
        const gp = s.projects.filter(p => p.id && p.groupId === group.id);
        const go = s.terminalOverviews.filter(o => o.groupId === group.id);
        const active = s.activeProjectId === group.id || gp.some(p => p.id === s.activeProjectId);
        const gKey = group.id ? `group-${group.id}` : `group-idx-${gIdx}`;
        return (
          <div key={gKey} className={`flex transition-all ${verticalTabs ? 'flex-col w-full' : 'items-center h-full'} ${compactMode ? 'bg-gray-100/80 border-r border-gray-200' : 'bg-gray-100 border border-gray-200/50 p-1 rounded-xl self-center gap-1 shadow-sm'}`}>
            <div onClick={() => s.toggleGroup(group.id)} className={`flex items-center gap-1.5 px-2 h-full cursor-pointer transition-all ${compactMode ? (verticalTabs ? 'border-b border-gray-200 py-2' : 'py-1') : (verticalTabs ? 'py-2 px-3' : 'rounded-lg min-w-[60px]')} ${active ? 'text-black' : 'text-gray-400 hover:text-black'}`}>
              {group.collapsed ? <ChevronRight size={10} className="shrink-0" /> : <ChevronDown size={10} className="shrink-0" />}
              <span className="text-[8px] font-black uppercase truncate max-w-[80px] tracking-widest">{group.name}</span>
            </div>
            {!group.collapsed && (
              <div className={`flex ${verticalTabs ? 'flex-col w-full pl-2 border-l border-gray-200 mt-1' : 'items-center h-full gap-1'}`}>
                {go.filter(o => !!o.id).map(o => <TabItem key={`ov-g-${o.id}`} id={o.id} type="overview" active={s.activeProjectId === o.id} compactMode={compactMode} onClick={s.switchProject} onClose={s.closeTerminalOverview} onContextMenu={(e: any, id: string, type: any) => s.setContextMenu({ x: e.clientX, y: e.clientY, itemId: id, groupId: null, type })} renamingId={s.renamingId} tempName={s.tempName} setTempName={s.setTempName} submitRename={s.submitRename} vertical={verticalTabs} />)}
                {gp.filter(p => !!p.id).map(p => <TabItem key={`pj-g-${p.id}`} id={p.id} type="project" active={s.activeProjectId === p.id} compactMode={compactMode} onClick={s.switchProject} onClose={s.closeProject} onContextMenu={(e: any, id: string, type: any) => s.setContextMenu({ x: e.clientX, y: e.clientY, itemId: id, groupId: null, type })} renamingId={s.renamingId} tempName={s.tempName} setTempName={s.setTempName} submitRename={s.submitRename} vertical={verticalTabs} />)}
              </div>
            )}
          </div>
        );
      })}
      {s.terminalOverviews.filter(o => !o.groupId && !!o.id).map(o => <TabItem key={`ov-root-${o.id}`} id={o.id} type="overview" active={s.activeProjectId === o.id} compactMode={compactMode} onClick={s.switchProject} onClose={s.closeTerminalOverview} onContextMenu={(e: any, id: string, type: any) => s.setContextMenu({ x: e.clientX, y: e.clientY, itemId: id, groupId: null, type })} renamingId={s.renamingId} tempName={s.tempName} setTempName={s.setTempName} submitRename={s.submitRename} vertical={verticalTabs} />)}
      {s.projects.filter(p => !p.groupId && !!p.id).map(p => <TabItem key={`pj-root-${p.id}`} id={p.id} type="project" active={s.activeProjectId === p.id} compactMode={compactMode} onClick={s.switchProject} onClose={s.closeProject} onContextMenu={(e: any, id: string, type: any) => s.setContextMenu({ x: e.clientX, y: e.clientY, itemId: id, groupId: null, type })} renamingId={s.renamingId} tempName={s.tempName} setTempName={s.setTempName} submitRename={s.submitRename} vertical={verticalTabs} />)}
      {useStore.getState().showSettings && <TabItem key="st-settings" id="settings" type="settings" active={s.activeProjectId === 'settings'} compactMode={compactMode} onClick={s.switchProject} onClose={() => useStore.getState().toggleSettings(false)} onContextMenu={(e: any) => e.preventDefault()} vertical={verticalTabs} />}
      <div className={`flex items-center shrink-0 ${verticalTabs ? 'w-full py-4 border-t border-gray-100 mt-2 justify-center gap-4' : `px-2 ${compactMode ? 'h-full border-l border-gray-200 bg-white' : 'gap-1 ml-1'}`}`}>
        {s.allTabs.length > 2 && <button onClick={() => s.setShowCloseModal(true)} className={`p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all ${verticalTabs ? 'scale-125' : ''}`}><Trash2 size={12} /></button>}
        <button onClick={onOpen} className={`p-1.5 text-gray-400 hover:text-black hover:bg-gray-50 rounded-lg ${verticalTabs ? 'scale-125' : ''}`}><Plus size={12} /></button>
      </div>
      <TabContextMenu 
        menu={s.contextMenu} 
        onHide={() => s.setContextMenu(null)} 
        onRename={(id: string, type: any) => { 
          const it = type === 'overview' ? s.terminalOverviews.find(o => o.id === id) : s.projects.find(p => p.id === id); 
          s.setRenamingId(id); 
          s.setTempName(it?.name || ""); 
          s.setContextMenu(null); 
        }} 
        onConfigure={(id: string) => { 
          s.handleOpenEditOverview(id); 
          s.setContextMenu(null); 
        }} 
        onCreateGroup={(id: string) => { 
          s.setPendingItemId(id);
          s.setShowGroupModal(true); 
          s.setContextMenu(null); 
        }} 
        onMoveToGroup={(id: string, g: any, dg: any) => { 
          if (dg) {
            if (window.confirm(t('tabs.confirm_delete_group') || "Are you sure you want to delete this group? Items will be moved to the main list.")) {
              s.deleteGroup(dg);
            }
          } else {
            s.moveToGroup(id, g);
          }
          s.setContextMenu(null); 
        }} 
        groups={s.groups} 
        projects={s.projects} 
        terminalOverviews={s.terminalOverviews} 
      />
    </div>
  );
});

ProjectTabs.displayName = 'ProjectTabs';
