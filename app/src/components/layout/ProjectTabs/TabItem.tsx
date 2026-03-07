import { X, Folder, Loader2, Terminal, Settings, Monitor, FileCode, Columns, Zap, ImageIcon } from "lucide-react";
import { useStore } from "../../../store/useStore";
import { memo, useCallback } from "react";

const SETTINGS_TAB = { id: 'settings', name: 'Settings' };

export const TabItem = memo(({ id, type, active, compactMode, onClick, onClose, onContextMenu, renamingId, tempName, setTempName, submitRename, vertical, mode }: any) => {
  const item = useStore(useCallback(s => 
    type === 'overview' ? s.terminalOverviews.find(o => o.id === id) : 
    type === 'project' ? s.projects.find(p => p.id === id) :
    null
  , [id, type]));

  if (type !== 'settings' && type !== 'view-mode' && !item) return null;

  const getIcon = () => {
    if (type === 'overview') return Terminal;
    if (type === 'settings') return Settings;
    if (type === 'view-mode') {
      if (mode === 'preview') return Monitor;
      if (mode === 'code') return FileCode;
      if (mode === 'split') return Columns;
    }
    return Folder;
  };
  const Icon = getIcon();
  const status = item ? (item as any).status : null;
  const isLoading = item ? (item as any).isLoading : false;
  const displayName = type === 'settings' ? 'Settings' : 
                    type === 'view-mode' ? id.replace('view-mode-', '').toUpperCase() : 
                    item?.name;

  return (
    <div 
      onClick={(e: React.MouseEvent) => renamingId !== id && onClick(id, mode)}
      onContextMenu={(e) => { e.preventDefault(); onContextMenu(e, id, type); }}
      className={`group relative flex items-center gap-2 px-3 transition-all cursor-pointer shrink-0 overflow-hidden select-none ${vertical ? 'w-full h-10 mb-0.5' : 'h-8 min-w-[140px] max-w-[200px] self-center'} ${
        active 
          ? (compactMode ? 'bg-panel-bg border-r border-border shadow-none' : 'bg-panel-bg border border-border shadow-sm rounded-lg') 
          : (compactMode ? 'bg-transparent text-foreground/40 border-r border-border' : 'bg-transparent text-foreground/40 hover:bg-panel-bg/40 rounded-lg')
      } ${vertical ? (active ? 'border-l-4 border-l-foreground !border-r-0 !rounded-none bg-sidebar-bg/50' : 'border-l-4 border-l-transparent hover:bg-sidebar-bg/30') : ''}`}
    >
      <div className="relative z-10 flex items-center gap-2 flex-1 min-w-0 pr-6">
        <div className="relative shrink-0 flex items-center justify-center w-4 h-4">
          {isLoading ? (
            <Loader2 size={12} className={`${active ? 'text-foreground' : 'text-foreground/40'} animate-spin`} />
          ) : (
            <Icon size={12} className={active ? 'text-foreground' : 'text-foreground/30'} />
          )}
          {status === 'intervene' && !isLoading && (
            <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
          )}
        </div>
        {renamingId === id ? (
          <input autoFocus value={tempName} onChange={(e) => setTempName(e.target.value)} onBlur={submitRename} onKeyDown={(e) => e.key === 'Enter' && submitRename()} onClick={(e) => e.stopPropagation()} className="bg-active-bg border-none outline-none text-[9px] font-black uppercase w-full rounded px-1 text-foreground" />
        ) : (
          <span className={`text-[9px] font-black uppercase tracking-tight truncate ${active ? 'text-foreground' : 'text-foreground/40'}`}>{displayName}</span>
        )}
      </div>
      {type !== 'view-mode' && type !== 'settings' && (
        <button 
          onClick={(e) => { e.stopPropagation(); onClose(id); }} 
          className={`absolute right-1 w-6 h-6 flex items-center justify-center hover:bg-hover-bg rounded-full text-foreground/40 hover:text-red-500 transition-all z-20 ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
        >
          <X size={10} />
        </button>
      )}
    </div>
  );
});

TabItem.displayName = 'TabItem';
