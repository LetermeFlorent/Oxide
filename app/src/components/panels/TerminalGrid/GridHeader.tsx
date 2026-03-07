
import { memo } from "react";
import { Zap, Send } from "lucide-react";
import { t } from "../../../i18n";

interface GridHeaderProps {
  name: string;
  count: number;
  cmd: string;
  setCmd: (cmd: string) => void;
  onBroadcast: (e: React.FormEvent) => void;
}

export const GridHeader = memo(({ name, count, cmd, setCmd, onBroadcast }: GridHeaderProps) => (
  <div className="h-10 px-4 flex items-center bg-sidebar-bg border-b border-border gap-4 shrink-0">
    <div className="flex items-center gap-2 shrink-0">
      <Zap size={14} className="text-orange-500 fill-orange-500" />
      <span className="text-[9px] font-black text-foreground uppercase tracking-[0.2em]">{name}</span>
    </div>
    <form onSubmit={onBroadcast} className="flex-1 flex items-center bg-panel-bg border border-border rounded-lg px-3 h-7 focus-within:border-foreground/40 transition-all">
      <input 
        type="text" value={cmd} onChange={e => setCmd(e.target.value)} 
        placeholder={t('overview.broadcast_placeholder', { count })} 
        className="flex-1 bg-transparent border-none outline-none text-[10px] font-bold text-foreground" 
      />
      <button type="submit" className="p-1 hover:bg-hover-bg rounded text-foreground/40"><Send size={12} /></button>
    </form>
  </div>
));

GridHeader.displayName = 'GridHeader';
