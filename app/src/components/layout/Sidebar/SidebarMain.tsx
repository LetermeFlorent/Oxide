
import { memo, useState } from "react";
import { useStore } from "../../../store/useStore";
import { selectActiveProject } from "../../../store/selectors";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarList } from "./SidebarList";
import { SidebarModals } from "./SidebarModals";
import { useSidebarActions } from "./useSidebarActions";
import { useSidebarWorker, ITEM_HEIGHT } from "./useSidebarWorker";
import { useFileActions } from "../../panels/Explorer/useFileActions";

export const Sidebar = memo(({ onFileClick }: { onFileClick: (f: any) => void }) => {
  const expandedFolders = useStore(s => s.expandedFolders);
  const compactMode = useStore(s => s.compactMode);
  const explorerModal = useStore(s => s.explorerModal);
  const setExplorerModal = useStore(s => s.setExplorerModal);
  
  const ap = useStore(selectActiveProject);
  const [sq, setSq] = useState("");
  
  const { scrollRef, setScrollTop, expandedCount, visibleItems } = useSidebarWorker(ap, expandedFolders, sq);
  const { isIndexing, handleReindex, handleExplorerConfirm } = useSidebarActions(ap);
  const [bgMenu, setBgMenu] = useState<{ x: number, y: number } | null>(null);
  const h = useFileActions(ap?.id || "");

  return (
    <div className={`flex-1 flex flex-col bg-panel-bg overflow-hidden select-none ${compactMode ? '' : 'rounded-[18px] shadow-sm'}`}>
      <SidebarHeader q={sq} setQ={setSq} />
      <div className="flex-1 flex flex-col min-h-0">
        <SidebarList 
          scrollRef={scrollRef} onScroll={setScrollTop} onContextMenu={(e: React.MouseEvent) => { e.preventDefault(); if (ap) setBgMenu({ x: e.clientX, y: e.clientY }); }} 
          height={expandedCount * ITEM_HEIGHT} visibleItems={visibleItems || []} 
          onFileClick={onFileClick} projectId={ap?.id || ""} 
          isLoading={ap?.isLoading || false} searchEmpty={!!sq} 
        />
      </div>
      {ap && <SidebarModals 
        bgMenu={bgMenu} setBgMenu={setBgMenu} 
        activeProject={ap} 
        explorerModal={explorerModal} setExplorerModal={setExplorerModal}
        h={h} onConfirm={(name: string) => handleExplorerConfirm(name, explorerModal)}
      />}
    </div>
  );
});

Sidebar.displayName = 'Sidebar';
