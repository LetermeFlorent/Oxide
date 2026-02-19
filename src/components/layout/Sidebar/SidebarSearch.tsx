import { memo } from "react";
import { Search, Loader2 } from "lucide-react";
import { t } from "../../../i18n";

export const SidebarSearch = memo(({ query, onChange, isSearching }: any) => (
  <div className="px-3 py-2 border-b border-gray-100">
    <div className="relative">
      <Search size={12} className={`absolute left-2.5 top-1/2 -translate-y-1/2 ${query ? 'text-black' : 'text-gray-400'}`} />
      <input 
        type="text" value={query} 
        onChange={(e) => onChange(e.target.value)} 
        placeholder={t('sidebar.search_placeholder')} 
        className="w-full pl-8 pr-8 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-[11px] font-bold text-gray-700 outline-none focus:border-black/50 transition-all" 
      />
      {isSearching && <Loader2 size={10} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-gray-600" />}
    </div>
  </div>
));
