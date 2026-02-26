import { Pencil, Trash2, FolderSearch, FilePlus, FolderPlus, Target } from "lucide-react";
import { memo } from "react";
import { ContextMenuContainer, ContextMenuItem, ContextMenuSeparator } from "../../../ui/ContextMenu";

export const FileContextMenu = memo(({ menu, onHide, onRename, onDelete, onReveal, onCreateFile, onCreateFolder, isFollowing, onToggleFollow }: any) => {
  if (!menu) return null;
  const isProtected = menu.entry.path === menu.entry.name;
  const isMd = menu.entry.name.toLowerCase().endsWith('.md');

  return (
    <ContextMenuContainer x={menu.x} y={menu.y} onHide={onHide}>
      {onRename && !isProtected && (
        <ContextMenuItem icon={Pencil} label="Rename" onClick={() => { onRename(menu.entry); onHide(); }} />
      )}
      <ContextMenuItem icon={FolderSearch} label="Reveal in Explorer" onClick={() => { onReveal(menu.entry); onHide(); }} />
      
      {isMd && onToggleFollow && (
        <ContextMenuItem 
          icon={Target} 
          label={isFollowing ? "Unfollow File" : "Follow File"} 
          onClick={() => { onToggleFollow(menu.entry); onHide(); }} 
        />
      )}

      <ContextMenuSeparator />
      <ContextMenuItem icon={FilePlus} label="New File" onClick={() => { onCreateFile(menu.entry); onHide(); }} />
      <ContextMenuItem icon={FolderPlus} label="New Folder" onClick={() => { onCreateFolder(menu.entry); onHide(); }} />
      
      {onDelete && !isProtected && (
        <>
          <ContextMenuSeparator />
          <ContextMenuItem icon={Trash2} label="Delete" variant="danger" onClick={() => { onDelete(menu.entry); onHide(); }} />
        </>
      )}
    </ContextMenuContainer>
  );
});
