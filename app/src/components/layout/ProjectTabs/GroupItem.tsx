import { ChevronRight, ChevronDown, Folder } from "lucide-react";
import { TabItem } from "./TabItem";
import { safeKey } from "../../../utils/ui/keyUtils";

export const GroupItem = ({ group, gp, go, active, verticalTabs, s }: any) => {
  const isEmpty = gp.length === 0 && go.length === 0;

  return (
    <div className={`flex transition-all select-none ${verticalTabs ? 'flex-col w-full p-1 bg-foreground/[0.03] border border-border/30 rounded-xl mb-2' : `items-center ${group.collapsed ? 'h-8' : 'h-[34px]'} px-1 bg-foreground/[0.05] border border-border/50 rounded-lg gap-1 shadow-sm`}`}>
      <div 
        onClick={(e) => { e.stopPropagation(); !isEmpty && s.toggleGroup(group.id); }} 
        onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); s.setContextMenu({ x: e.clientX, y: e.clientY, itemId: null, groupId: group.id, type: 'group' }); }}
        className={`flex items-center gap-1.5 px-2 cursor-pointer transition-all ${verticalTabs ? 'py-3 w-full hover:bg-foreground/5 rounded-lg' : 'h-8 rounded-lg min-w-[60px]'} ${active ? 'text-foreground' : 'text-foreground/40 hover:text-foreground'}`}
      >
        {!isEmpty && (group.collapsed ? <ChevronRight size={10} className="shrink-0 opacity-40" /> : <ChevronDown size={10} className="shrink-0 opacity-40" />)}
        <Folder size={12} className={active ? 'text-indigo-oxide' : 'text-foreground/20'} strokeWidth={3} />
        <span className={`${verticalTabs ? 'text-[10px]' : 'text-[9px]'} font-black uppercase truncate max-w-[80px] tracking-tight`}>{group.name}</span>
      </div>
      {!group.collapsed && !isEmpty && (
        <div className={`flex ${verticalTabs ? 'flex-col w-full pl-2 pr-1 pb-1 gap-1 mt-1' : 'items-center h-full gap-0.5'}`}>
          {go.filter((o: any) => o?.id?.trim()).map((o: any) => (
            <TabItem key={safeKey('ov-g', o.id)} id={o.id} type="overview" active={s.activeProjectId === o.id} onClick={s.switchProject} onClose={s.closeTerminalOverview} onContextMenu={(e: any, id: string, type: any) => s.setContextMenu({ x: e.clientX, y: e.clientY, itemId: id, groupId: null, type })} renamingId={s.renamingId} tempName={s.tempName} setTempName={s.setTempName} submitRename={s.submitRename} vertical={verticalTabs} isNested />
          ))}
          {gp.filter((p: any) => p?.id?.trim()).map((p: any) => (
            <TabItem key={safeKey('pj-g', p.id)} id={p.id} type="project" active={s.activeProjectId === p.id} onClick={s.switchProject} onClose={s.closeProject} onContextMenu={(e: any, id: string, type: any) => s.setContextMenu({ x: e.clientX, y: e.clientY, itemId: id, groupId: null, type })} renamingId={s.renamingId} tempName={s.tempName} setTempName={s.setTempName} submitRename={s.submitRename} vertical={verticalTabs} isNested />
          ))}
        </div>
      )}
    </div>
  );
};
