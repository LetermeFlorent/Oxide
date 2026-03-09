
import { Trash2, Plus } from "lucide-react";
import { useStore } from "../../../store/useStore";
import { memo, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useShallow } from "zustand/react/shallow";
import { OverviewModal } from "../../ui/Modals/OverviewModal";
import { GroupModal } from "./GroupModal";
import { CloseTabsModal } from "./CloseTabsModal";
import { TabContextMenu } from "./TabContextMenu";
import { useProjectTabs } from "./useProjectTabs";
import { UnifiedTabsList } from "./UnifiedTabsList";
import { useProjectTabsReorder } from "./useProjectTabsReorder";

export const ProjectTabs = memo(({ onOpen, sharedState }: { onOpen: () => void, sharedState?: any }) => {
  const s = sharedState || useProjectTabs();
  const tabBarRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { verticalTabs, setViewMode, viewMode } = useStore(useShallow(state => ({ verticalTabs: state.verticalTabs, viewMode: state.viewMode, setViewMode: state.setViewMode })));
  const { handleDrag, handleDragEnd, handleReorder } = useProjectTabsReorder(s.allTabs, s.setGlobalTabsOrder, setIsDragging);

  return (
    <div ref={tabBarRef} onWheel={(e) => !verticalTabs && (e.currentTarget.scrollLeft += e.deltaY)} data-tauri-drag-region className={`flex shrink-0 select-none transition-colors relative ${isDragging ? 'z-[9999] overflow-visible' : 'z-10'} ${verticalTabs ? 'flex-col gap-1 p-2 w-full h-full overflow-y-auto scrollbar-modern-thin' : 'items-center overflow-x-auto scrollbar-modern-thin gap-1 h-10 -mx-1 px-1'}`}>
      <UnifiedTabsList s={s} verticalTabs={verticalTabs} viewMode={viewMode} onDrag={handleDrag} onDragEnd={handleDragEnd} onReorder={handleReorder} />
      <div className={`flex items-center shrink-0 ${verticalTabs ? 'w-full py-4 border-t border-border mt-2 justify-center gap-4' : 'px-2 gap-1 ml-1'}`}>
        {s.allTabs.length > 2 && <button onClick={() => s.setShowCloseModal(true)} className={`p-1.5 text-foreground/40 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all ${verticalTabs ? 'scale-125' : ''}`}><Trash2 size={12} /></button>}
        <button onClick={onOpen} className={`p-1.5 text-foreground/40 hover:text-foreground hover:bg-hover-bg rounded-lg ${verticalTabs ? 'scale-125' : ''}`}><Plus size={12} /></button>
      </div>
    </div>
  );
});
ProjectTabs.displayName = 'ProjectTabs';
