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
        className="w-full flex items-center justify-between px-2 py-2 rounded-lg transition-all hover:bg-hover-bg group"
      >
        <span className={`text-[11px] font-bold uppercase tracking-tight truncate mr-2 ${
          selectedIds.includes(p.id) ? 'text-foreground' : 'text-foreground/30 group-hover:text-foreground/50'
        }`}>{p.name}</span>
        <div className={`w-4 h-4 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
          selectedIds.includes(p.id) 
            ? 'bg-foreground border-foreground text-background scale-110 shadow-lg' 
            : 'bg-transparent border-border group-hover:border-foreground/30'
        }`}>
          {selectedIds.includes(p.id) && <Check size={10} strokeWidth={4} />}
        </div>
      </button>
    ))}
    {!projects.length && (
      <div className="py-10 text-center border-2 border-dashed border-sidebar-bg rounded-[12px]">
        <span className="text-[10px] font-black uppercase tracking-widest text-foreground/20 italic">{t('explorer.open_folders_first')}</span>
      </div>
    )}
  </div>
));

ProjectSelectorList.displayName = 'ProjectSelectorList';
