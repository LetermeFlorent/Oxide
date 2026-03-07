import { Trash2, Edit2, Plus, Library, Settings, XCircle } from "lucide-react";
import { ContextMenuContainer, ContextMenuItem } from "../../ui/ContextMenu";
import { t } from "../../../i18n";
import { safeKey } from "../../../utils/ui/keyUtils";

export const TabContextMenu = ({ menu, onHide, onRename, onConfigure, onCreateGroup, onMoveToGroup, onDeleteGroup, groups, projects, terminalOverviews, isViewMode, onCloseProject, onCloseOverview }: any) => {
  if (!menu) return null;

  if (menu.type === 'group') {
    return (
      <ContextMenuContainer x={menu.x} y={menu.y} onHide={onHide}>
        <ContextMenuItem icon={Edit2} label="Rename Group" onClick={() => { onRename(menu.groupId, 'group'); onHide(); }} />
        <div className="my-1 border-t border-border" />
        <ContextMenuItem icon={Trash2} label="Delete Group" variant="danger" onClick={() => { onDeleteGroup(menu.groupId); onHide(); }} />
      </ContextMenuContainer>
    );
  }

  const currentItem = menu.type === 'overview' 
    ? terminalOverviews.find((o: any) => o.id === menu.itemId)
    : projects.find((p: any) => p.id === menu.itemId);

  const handleClose = () => {
    if (menu.type === 'overview') onCloseOverview(menu.itemId);
    else onCloseProject(menu.itemId);
    onHide();
  };

  return (
    <ContextMenuContainer x={menu.x} y={menu.y} onHide={onHide}>
      {!isViewMode && (
        <>
          <ContextMenuItem icon={Edit2} label={t('common.rename')} onClick={() => onRename(menu.itemId, menu.type)} />
          {menu.type === 'overview' && (
            <ContextMenuItem icon={Settings} label="Configure Grid" onClick={() => onConfigure(menu.itemId)} />
          )}
          <div className="my-1 border-t border-border" />
          <ContextMenuItem icon={Plus} label="New Group" onClick={() => onCreateGroup(menu.itemId)} />
          {groups.filter((g: any) => g?.id?.trim()).map((g: any, idx: number) => (
            <ContextMenuItem key={safeKey('ctx-group', g.id, idx)} icon={Library} label={g.name} onClick={() => onMoveToGroup(menu.itemId, g.id)} />
          ))}
          {currentItem?.groupId && (
            <ContextMenuItem icon={XCircle} label="Remove from Group" onClick={() => onMoveToGroup(menu.itemId, null)} />
          )}
        </>
      )}
      <div className="my-1 border-t border-border" />
      <ContextMenuItem icon={Trash2} label="Close Tab" onClick={handleClose} variant="danger" />
    </ContextMenuContainer>
  );
};
