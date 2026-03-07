import { LucideIcon } from "lucide-react";
import { safeKey } from "../../../utils/ui/keyUtils";

interface SettingsNavItem {
  id: string;
  label: string;
  desc: string;
  icon: LucideIcon;
}

export const SettingsNav = ({ items, active, onSelect }: { items: SettingsNavItem[], active: string, onSelect: (id: string) => void }) => (
  <div className="w-48 shrink-0 flex flex-col gap-1 p-2 border-r border-border bg-sidebar-bg/30">
    {items.map((item, idx) => (
      <button 
        key={safeKey('settings-nav', item.id, idx)} 
        onClick={() => onSelect(item.id)} 
        className={`w-full flex items-start gap-3 p-3 rounded-xl transition-all ${active === item.id ? 'bg-panel-bg shadow-sm border border-border' : 'hover:bg-panel-bg/50 opacity-60'}`}
      >
        <item.icon size={14} className={active === item.id ? 'text-foreground' : 'text-foreground/40'} />
        <div className="flex flex-col items-start overflow-hidden">
          <span className={`text-[10px] font-bold truncate w-full ${active === item.id ? 'text-foreground' : 'text-foreground/50'}`}>{item.label}</span>
          <span className="text-[8px] font-medium text-foreground/40 truncate w-full">{item.desc}</span>
        </div>
      </button>
    ))}
  </div>
);
