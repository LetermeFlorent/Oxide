
import { memo } from "react";
import { FileContextMenu } from "../../panels/Explorer/components/FileContextMenu";
import { ExplorerModal } from "../../panels/Explorer/ExplorerModal";
import { revealItemInDir } from "@tauri-apps/plugin-opener";
import { t } from "../../../i18n";

export const SidebarModals = memo(({ bgMenu, setBgMenu, activeProject, explorerModal, setExplorerModal, h, onConfirm }: any) => (
  <>
    {bgMenu && (
      <FileContextMenu 
        menu={{ ...bgMenu, entry: { name: activeProject.name, path: activeProject.id, isFolder: true } }} 
        onHide={() => setBgMenu(null)} 
        onRename={null} onDelete={null} 
        onReveal={() => revealItemInDir(activeProject.id)}
        onCreateFile={() => h.onCreateFile({ path: activeProject.id, isFolder: true })}
        onCreateFolder={() => h.onCreateFolder({ path: activeProject.id, isFolder: true })}
      />
    )}
    <ExplorerModal 
      show={!!explorerModal} 
      type={explorerModal?.type || 'file'} 
      onHide={() => setExplorerModal(null)} 
      onConfirm={onConfirm}
      title={!explorerModal?.target ? (explorerModal?.type === 'file' ? t('explorer.new_root_file') : t('explorer.new_root_folder')) : undefined}
    />
  </>
));

SidebarModals.displayName = 'SidebarModals';
