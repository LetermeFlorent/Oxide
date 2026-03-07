
import { memo } from "react";
import { RotateCw, Search, PanelLeft } from "lucide-react";
import { t } from "../../../i18n";
import { useStore } from "../../../store/useStore";
import { useFileOperations } from "../../../hooks/useFileOperations";
import { selectActiveProject } from "../../../store/selectors";
import { PanelHeader } from "../../ui/PanelHeader";

export const SidebarHeader = memo(({ q, setQ }: { q: string, setQ: (v: string) => void }) => {
  const ap = useStore(selectActiveProject);
  const { refreshTree } = useFileOperations();

  return (
    <div className="flex flex-col bg-panel-bg border-b border-border">
      <PanelHeader icon={PanelLeft} title={ap?.name || t('sidebar.explorer')}>
        <button 
          onClick={() => ap?.id && refreshTree(ap.id)} 
          className="p-1 hover:bg-hover-bg rounded-md text-foreground/40 hover:text-foreground transition-colors"
          title={t('explorer.reindex')}
        >
          <RotateCw size={12} />
        </button>
      </PanelHeader>

      {/* Search Bar */}
      <div className="p-3 relative group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-foreground/30 group-focus-within:text-foreground transition-colors" size={12} />
        <input 
          type="text" value={q} onChange={e => setQ(e.target.value)} 
          placeholder={t('sidebar.search_placeholder')} 
          className="w-full pl-9 pr-4 py-2 bg-sidebar-bg border border-border rounded-xl text-[10px] font-bold text-foreground outline-none focus:bg-panel-bg focus:border-foreground/10 transition-all" 
        />
      </div>
    </div>
  );
});

SidebarHeader.displayName = 'SidebarHeader';
