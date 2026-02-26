
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
  <div className="h-10 px-4 flex items-center bg-gray-50 border-b border-gray-100 gap-4 shrink-0">
    <div className="flex items-center gap-2 shrink-0">
      <Zap size={14} className="text-orange-500 fill-orange-500" />
      <span className="text-[9px] font-black text-gray-800 uppercase tracking-[0.2em]">{name}</span>
    </div>
    <form onSubmit={onBroadcast} className="flex-1 flex items-center bg-white border border-gray-200 rounded-lg px-3 h-7 focus-within:border-gray-600 transition-all">
      <input 
        type="text" value={cmd} onChange={e => setCmd(e.target.value)} 
        placeholder={t('overview.broadcast_placeholder', { count })} 
        className="flex-1 bg-transparent border-none outline-none text-[10px] font-bold text-gray-700" 
      />
      <button type="submit" className="p-1 hover:bg-gray-100 rounded text-gray-400"><Send size={12} /></button>
    </form>
  </div>
));

GridHeader.displayName = 'GridHeader';
