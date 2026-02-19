import { X, Folder, Loader2, Terminal, Settings } from "lucide-react";
import { useStore } from "../../../store/useStore";
import { memo, useCallback } from "react";

const SETTINGS_TAB = { id: 'settings', name: 'Settings' };

export const TabItem = memo(({ id, type, active, compactMode, onClick, onClose, onContextMenu, renamingId, tempName, setTempName, submitRename, vertical }: any) => {
  const item = useStore(useCallback(s => 
    type === 'overview' ? s.terminalOverviews.find(o => o.id === id) : 
    type === 'settings' ? SETTINGS_TAB :
    s.projects.find(p => p.id === id)
  , [id, type]));

  if (!item) return null;

  const Icon = type === 'overview' ? Terminal : (type === 'settings' ? Settings : Folder);
  const progress = (item as any).taskProgress;
  const status = (item as any).status;
  const isLoading = (item as any).isLoading;

  const isLoadingOrWorking = isLoading || status === 'working';

  return (
    <div 
      onClick={() => renamingId !== id && onClick(id)}
      onContextMenu={(e) => { e.preventDefault(); onContextMenu(e, id, type); }}
      className={`group relative flex items-center gap-2 px-3 transition-all cursor-pointer shrink-0 overflow-hidden select-none ${vertical ? 'w-full h-10' : 'h-8 min-w-[140px] max-w-[200px] self-center'} ${
        active 
          ? (compactMode ? 'bg-white border-r border-gray-200 shadow-none' : 'bg-white border border-gray-100 shadow-sm rounded-lg') 
          : (compactMode ? 'bg-transparent text-gray-400 border-r border-gray-100' : 'bg-transparent text-gray-400 hover:bg-white/40 rounded-lg')
      } ${vertical && active ? 'border-l-4 border-l-black !border-r-0 !rounded-none' : ''}`}
    >
      <div className="relative z-10 flex items-center gap-2 flex-1 min-w-0 pr-6">
        <div className="relative shrink-0 flex items-center justify-center w-4 h-4">
          {isLoadingOrWorking ? (
            <Loader2 size={12} className={`${active ? 'text-black' : 'text-gray-400'} animate-spin`} />
          ) : (
            <Icon size={12} className={active ? 'text-black' : 'text-gray-300'} />
          )}
          {status === 'intervene' && !isLoading && (
            <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
          )}
          {status === 'working' && !isLoading && (
            <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-black animate-pulse" />
          )}
        </div>
        {renamingId === id ? (
          <input autoFocus value={tempName} onChange={(e) => setTempName(e.target.value)} onBlur={submitRename} onKeyDown={(e) => e.key === 'Enter' && submitRename()} onClick={(e) => e.stopPropagation()} className="bg-gray-100 border-none outline-none text-[9px] font-black uppercase w-full rounded px-1 text-gray-800" />
        ) : (
          <span className={`text-[9px] font-black uppercase tracking-tight truncate ${active ? 'text-gray-800' : 'text-gray-400'}`}>{item.name}</span>
        )}
      </div>
      <button 
        onClick={(e) => { e.stopPropagation(); onClose(id); }} 
        className={`absolute right-1 w-6 h-6 flex items-center justify-center hover:bg-gray-100 rounded-full text-gray-400 hover:text-red-500 transition-all z-20 ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
      >
        <X size={10} />
      </button>
    </div>
  );
});

TabItem.displayName = 'TabItem';
