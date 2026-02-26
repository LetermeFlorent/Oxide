import { memo } from "react";
import { FileContextMenu } from "../../panels/Explorer/components/FileContextMenu";
import { ExplorerModal } from "../../panels/Explorer/ExplorerModal";
import { revealItemInDir } from "@tauri-apps/plugin-opener";
import { t } from "../../../i18n";

export const SidebarModals = memo(({ m, setM, p, h, a }: any) => (
  <>
    {m && (
      <FileContextMenu 
        menu={m} 
        onHide={() => setM(null)} 
        onRename={h.onRename} 
        onDelete={h.onDelete} 
        onReveal={h.onReveal}
        onCreateFile={h.onCreateFile}
        onCreateFolder={h.onCreateFolder}
      />
    )}
    {a.explorerModal && (
      <ExplorerModal 
        show={true} 
        type={a.explorerModal.type} 
        onHide={() => a.setExplorerModal(null)} 
        onConfirm={a.handleExplorerConfirm}
        title={!a.explorerModal.target ? (a.explorerModal.type === 'file' ? t('explorer.new_root_file') : t('explorer.new_root_folder')) : undefined}
      />
    )}
  </>
));

SidebarModals.displayName = 'SidebarModals';
