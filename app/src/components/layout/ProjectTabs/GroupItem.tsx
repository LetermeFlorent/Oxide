/**
 * Project: Oxide App
 * Responsibility: Individual Tab Group Component
 * License: O.A.S - MS-RSL (Microsoft Reference Source License)
 * Copyright (c) 2026 O.A.S (Optimization & Quality). All rights reserved.
 */
import { ChevronRight, ChevronDown } from "lucide-react";
import { TabItem } from "./TabItem";

export const GroupItem = ({ group, gp, go, active, compactMode, verticalTabs, s }: any) => (
  <div className={`flex transition-all ${verticalTabs ? 'flex-col w-full' : 'items-center h-full'} ${compactMode ? 'bg-gray-100/80 border-r border-gray-200' : 'bg-gray-100 border border-gray-200/50 p-1 rounded-xl self-center gap-1 shadow-sm'}`}>
    <div 
      onClick={() => s.toggleGroup(group.id)} 
      onContextMenu={(e) => { e.preventDefault(); s.setContextMenu({ x: e.clientX, y: e.clientY, itemId: null, groupId: group.id, type: 'group' }); }}
      className={`flex items-center gap-1.5 px-2 h-full cursor-pointer transition-all ${compactMode ? (verticalTabs ? 'border-b border-gray-200 py-2' : 'py-1') : (verticalTabs ? 'py-2 px-3' : 'rounded-lg min-w-[60px]')} ${active ? 'text-black' : 'text-gray-400 hover:text-black'}`}
    >
      {group.collapsed ? <ChevronRight size={10} className="shrink-0" /> : <ChevronDown size={10} className="shrink-0" />}
      <span className="text-[8px] font-black uppercase truncate max-w-[80px] tracking-widest">{group.name}</span>
    </div>
    {!group.collapsed && (
      <div className={`flex ${verticalTabs ? 'flex-col w-full pl-2 border-l border-gray-200 mt-1' : 'items-center h-full gap-1'}`}>
        {go.filter((o: any) => !!o.id).map((o: any) => <TabItem key={`ov-g-${o.id}`} id={o.id} type="overview" active={s.activeProjectId === o.id} compactMode={compactMode} onClick={s.switchProject} onClose={s.closeTerminalOverview} onContextMenu={(e: any, id: string, type: any) => s.setContextMenu({ x: e.clientX, y: e.clientY, itemId: id, groupId: null, type })} renamingId={s.renamingId} tempName={s.tempName} setTempName={s.setTempName} submitRename={s.submitRename} vertical={verticalTabs} />)}
        {gp.filter((p: any) => !!p.id).map((p: any) => <TabItem key={`pj-g-${p.id}`} id={p.id} type="project" active={s.activeProjectId === p.id} compactMode={compactMode} onClick={s.switchProject} onClose={s.closeProject} onContextMenu={(e: any, id: string, type: any) => s.setContextMenu({ x: e.clientX, y: e.clientY, itemId: id, groupId: null, type })} renamingId={s.renamingId} tempName={s.tempName} setTempName={s.setTempName} submitRename={s.submitRename} vertical={verticalTabs} />)}
      </div>
    )}
  </div>
);
