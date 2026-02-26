
import { memo } from "react";

export interface TabProps {
  active: boolean; onClick: () => void; icon: any; label: string; 
  activeClass: string; disabled?: boolean;
}

export const TerminalTab = memo(({ active, onClick, icon: Icon, label, activeClass, disabled }: TabProps) => (
  <button
    disabled={disabled} onClick={(e) => { e.stopPropagation(); onClick(); }}
    className={`flex items-center gap-1.5 h-full border-b-2 transition-all ${disabled ? 'opacity-50' : ''} ${active ? activeClass : 'border-transparent text-gray-400 hover:text-gray-600'}`}
  >
    <Icon size={12} /><span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
  </button>
));

TerminalTab.displayName = 'TerminalTab';
