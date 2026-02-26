
import { memo, useState } from "react";
import { useStore } from "../../../store/useStore";
import { selectActiveProject } from "../../../store/selectors";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarList } from "./SidebarList";
import { SidebarModals } from "./SidebarModals";
import { useSidebarActions } from "./useSidebarActions";
import { useSidebarWorker, ITEM_HEIGHT } from "./useSidebarWorker";

export const Sidebar = memo(({ onFileClick }: { onFileClick: (f: any) => void }) => {
  const s = useStore();
  const ap = useStore(selectActiveProject);
  const [sq, setSq] = useState("");
  
  const { scrollRef, setScrollTop, expandedCount, visibleItems } = useSidebarWorker(ap, s.expandedFolders, sq);
  const { a, m, setM, h } = useSidebarActions(s.projects, s.terminalOverviews);

  return (
    <div className={`flex-1 flex flex-col bg-white overflow-hidden select-none ${s.compactMode ? '' : 'rounded-xl shadow-sm border border-gray-100'}`}>
      <SidebarHeader q={sq} setQ={setSq} />
      <div className="flex-1 flex flex-col min-h-0">
        <SidebarList 
          scrollRef={scrollRef} onScroll={setScrollTop} onContextMenu={() => {}} 
          height={expandedCount * ITEM_HEIGHT} visibleItems={visibleItems || []} 
          onFileClick={onFileClick} projectId={ap?.id || ""} 
          isLoading={ap?.isLoading || false} searchEmpty={!!sq} 
        />
      </div>
      <SidebarModals m={m} setM={setM} p={s.projects} h={h} a={a} />
    </div>
  );
});

Sidebar.displayName = 'Sidebar';
