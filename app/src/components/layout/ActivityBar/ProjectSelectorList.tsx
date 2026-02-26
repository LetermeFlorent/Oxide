import { memo } from "react";
import { Check } from "lucide-react";
import { t } from "../../../i18n";
import { safeKey } from "../../../utils/ui/keyUtils";

export const ProjectSelectorList = memo(({ projects, selectedIds, onToggle }: any) => (
  <div className="space-y-0.5">
    {projects.filter((p: any) => p?.id?.trim()).map((p: any, idx: number) => (
      <button 
        key={safeKey('proj-sel', p.id, idx)} 
        onClick={() => onToggle(p.id)} 
        className="w-full flex items-center justify-between px-2 py-2 rounded-lg transition-all hover:bg-black/[0.03] group"
      >
        <span className={`text-[11px] font-bold uppercase tracking-tight truncate mr-2 ${
          selectedIds.includes(p.id) ? 'text-black' : 'text-gray-300 group-hover:text-gray-500'
        }`}>{p.name}</span>
        <div className={`w-4 h-4 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
          selectedIds.includes(p.id) 
            ? 'bg-black border-black text-white scale-110 shadow-lg shadow-black/10' 
            : 'bg-transparent border-gray-100 group-hover:border-gray-200'
        }`}>
          {selectedIds.includes(p.id) && <Check size={10} strokeWidth={4} />}
        </div>
      </button>
    ))}
    {!projects.length && (
      <div className="py-10 text-center border-2 border-dashed border-gray-50 rounded-2xl">
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-200 italic">{t('explorer.open_folders_first')}</span>
      </div>
    )}
  </div>
));

ProjectSelectorList.displayName = 'ProjectSelectorList';
