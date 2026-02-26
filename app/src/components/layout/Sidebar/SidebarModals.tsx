
import { memo } from "react";
import { FileContextMenu } from "../../panels/Explorer/components/FileContextMenu";
import { ExplorerModal } from "../../panels/Explorer/ExplorerModal";
import { revealItemInDir } from "@tauri-apps/plugin-opener";
import { t } from "../../../i18n";

interface SidebarModalsProps {
  bgMenu: { x: number, y: number } | null;
  activeProject: { name: string, id: string };
  explorerModal: any;
  setBgMenu: (menu: any) => void;
  setExplorerModal: (modal: any) => void;
  onCreateFile: () => void;
  onCreateFolder: () => void;
  onConfirm: (name: string) => void;
}

export const SidebarModals = memo(({ 
  bgMenu, activeProject, explorerModal, setBgMenu, setExplorerModal, 
  onCreateFile, onCreateFolder, onConfirm 
}: SidebarModalsProps) => (
  <>
    {bgMenu && (
      <FileContextMenu 
        menu={{ ...bgMenu, entry: { name: activeProject.name, path: activeProject.id, isFolder: true } }} 
        onHide={() => setBgMenu(null)} 
        onRename={null} onDelete={null} 
        onReveal={() => revealItemInDir(activeProject.id)}
        onCreateFile={onCreateFile}
        onCreateFolder={onCreateFolder}
      />
    )}
    <ExplorerModal 
      show={!!explorerModal?.show} 
      type={explorerModal?.type || 'file'} 
      onHide={() => { setExplorerModal(null); setBgMenu(null); }} 
      onConfirm={onConfirm}
      title={!explorerModal?.target ? (explorerModal?.type === 'file' ? t('explorer.new_root_file') : t('explorer.new_root_folder')) : undefined}
    />
  </>
));

SidebarModals.displayName = 'SidebarModals';
