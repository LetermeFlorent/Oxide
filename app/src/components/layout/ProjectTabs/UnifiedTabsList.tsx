
import { Reorder } from "framer-motion";
import { TabItem } from "./TabItem";
import { GroupItem } from "./GroupItem";
import { safeKey } from "../../../utils/ui/keyUtils";
import { useStore } from "../../../store/useStore";

export const UnifiedTabsList = ({ s, verticalTabs, viewMode, onDrag, onDragEnd, onReorder }: any) => (
  <Reorder.Group as="div" axis={verticalTabs ? "y" : "x"} values={s.allTabs} onReorder={onReorder} className={`flex flex-nowrap items-center gap-1 list-none ${verticalTabs ? 'flex-col w-full' : 'h-full'}`}>
    {s.allTabs.map((t: any) => (
      <Reorder.Item as="div" key={safeKey('tab', t.id)} value={t} drag={verticalTabs ? "y" : "x"} dragListener={true} layout
        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
        transition={{ type: "spring", stiffness: 500, damping: 30, mass: 1 }}
        whileDrag={{ zIndex: 9999, scale: 1.1, cursor: 'grabbing' }} onDrag={onDrag} onDragEnd={onDragEnd} 
        className={`relative z-10 shrink-0 list-none ${verticalTabs ? 'w-full' : ''}`}
      >
        {t.type === 'group' ? (
          <GroupItem group={t.data} gp={s.projects.filter((p: any) => p.id && p.groupId === t.id)} go={s.terminalOverviews.filter((o: any) => o.groupId === t.id)} active={s.activeProjectId === t.id || s.projects.filter((p: any) => p.id && p.groupId === t.id).some((p: any) => p.id === s.activeProjectId)} verticalTabs={verticalTabs} s={s} />
        ) : (
          <TabItem id={t.id} type={t.type} mode={t.mode} active={t.type === 'view-mode' ? viewMode === t.mode : (t.type === 'settings' ? s.activeProjectId === 'settings' : s.activeProjectId === t.id)} onClick={(id: string, mode?: any) => { if (t.type === 'settings' || id === 'settings-tab') useStore.getState().toggleSettings(true); else s.switchProject(id, mode); }} onClose={(id: string) => t.type === 'overview' ? s.closeTerminalOverview(id) : (t.type === 'settings' ? useStore.getState().toggleSettings(false) : s.closeProject(id))} onContextMenu={(e: any, id: string, type: any) => t.type !== 'view-mode' && t.type !== 'settings' && s.setContextMenu({ x: e.clientX, y: e.clientY, itemId: id, groupId: null, type })} renamingId={s.renamingId} tempName={s.tempName} setTempName={s.setTempName} submitRename={s.submitRename} vertical={verticalTabs} />
        )}
      </Reorder.Item>
    ))}
  </Reorder.Group>
);
