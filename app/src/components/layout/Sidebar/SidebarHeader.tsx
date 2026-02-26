
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
    <div className="flex flex-col bg-white border-b border-gray-100">
      <PanelHeader icon={PanelLeft} title={ap?.name || t('sidebar.explorer')}>
        <button 
          onClick={() => ap?.id && refreshTree(ap.id)} 
          className="p-1 hover:bg-gray-50 rounded-md text-gray-400 hover:text-black transition-colors"
          title={t('explorer.reindex')}
        >
          <RotateCw size={12} />
        </button>
      </PanelHeader>

      {/* Search Bar */}
      <div className="p-3 relative group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" size={12} />
        <input 
          type="text" value={q} onChange={e => setQ(e.target.value)} 
          placeholder={t('sidebar.search_placeholder')} 
          className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-bold text-gray-600 outline-none focus:bg-white focus:border-black/10 transition-all" 
        />
      </div>
    </div>
  );
});

SidebarHeader.displayName = 'SidebarHeader';
