/**
 * @file TerminalGrid.tsx
 * @description Grid layout for displaying multiple terminals simultaneously
 * Provides a dashboard view of all terminals in a terminal overview
 * 
 * Features:
 * - Automatic grid layout calculation based on terminal count
 * - Broadcast command input to all terminals
 * - Individual terminal removal from overview
 * - Responsive grid with min/max sizing constraints
 * - Empty state with helpful instructions
 * 
 * @component TerminalGrid
 * @example
 * <TerminalGrid overviewId="overview-1" />
 */

import { useStore } from "../../store/useStore";
import { makeSelectOverviewById } from "../../store/selectors";
import { Terminal } from "./Terminal";
import { memo, useMemo, useState } from "react";
import { Zap, Send, X } from "lucide-react";
import { monitoredInvoke } from "../../utils/performance";

/**
 * TerminalGrid Component
 * 
 * Renders a grid of terminals for multi-project monitoring.
 * Each cell contains a fully functional terminal instance.
 * 
 * @param {Object} props - Component props
 * @param {string} props.overviewId - The terminal overview ID to display
 * @returns {JSX.Element} The terminal grid interface
 */
export const TerminalGrid = memo(({ overviewId }: { overviewId: string }) => {
  const compactMode = useStore(s => s.compactMode);
  
  // Get overview using memoized selector factory
  const overviewSelector = useMemo(() => makeSelectOverviewById(overviewId), [overviewId]);
  const overview = useStore(overviewSelector);
  
  const projectIdsString = overview?.projectIds.join(',') || '';
  const overviewName = overview?.name || '';

  const [masterCmd, setMasterCmd] = useState("");
  const pIds = useMemo(() => projectIdsString.split(',').filter(id => id && id.trim() !== ""), [projectIdsString]);

  /**
   * Remove a project from this terminal overview
   * @param {string} projectId - The project ID to remove
   */
  const handleRemoveProject = (projectId: string) => {
    const nextIds = pIds.filter(id => id !== projectId);
    useStore.getState().setTerminalOverviewProjects(overviewId, nextIds);
  };

  /**
   * Broadcast a command to all terminals in the grid
   * @param {React.FormEvent} e - Form submit event
   */
  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!masterCmd.trim() || pIds.length === 0) return;
    // Generate PTY IDs from project paths (matches BashTerminal logic)
    const ids = pIds.map(id => `bash-${id.replace(/[^a-zA-Z0-9]/g, '-')}`);
    monitoredInvoke("write_to_all_ptys", { ids, data: masterCmd + "\n" });
    setMasterCmd("");
  };

  const n = pIds.length;
  
  // Show empty state when no terminals in overview
  if (n === 0) return (
    <div className={`flex-1 flex flex-col items-center justify-center text-gray-400 gap-4 bg-white/50 border border-dashed border-gray-200 ${compactMode ? '' : 'rounded-xl'}`}>
      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center"><span className="text-xl">⌨️</span></div>
      <div className="text-center">
        <p className="text-[11px] font-black uppercase tracking-widest">Empty Overview</p>
        <p className="text-[9px] mt-1 italic">Right-click on the tab to add terminals</p>
      </div>
    </div>
  );

  // Calculate optimal grid layout based on terminal count
  let cols = 1; let rows = 1;
  if (n === 2) { cols = 2; rows = 1; }
  else if (n === 3) { cols = 3; rows = 1; }
  else if (n === 4) { cols = 2; rows = 2; }
  else if (n > 4) { cols = Math.ceil(Math.sqrt(n)); rows = Math.ceil(n / cols); }

  return (
    <div className={`flex-1 flex flex-col min-h-0 bg-white overflow-hidden ${compactMode ? '' : 'rounded-xl border border-gray-100 shadow-sm'}`}>
      <div className="h-10 px-4 flex items-center bg-gray-50 border-b border-gray-100 gap-4 shrink-0">
        <div className="flex items-center gap-2 shrink-0">
          <Zap size={14} className="text-orange-500 fill-orange-500" />
          <span className="text-[9px] font-black text-gray-800 uppercase tracking-[0.2em]">{overviewName}</span>
        </div>
        <form onSubmit={handleBroadcast} className="flex-1 flex items-center bg-white border border-gray-200 rounded-lg px-3 h-7 focus-within:border-gray-600 transition-all">
          <input type="text" value={masterCmd} onChange={e => setMasterCmd(e.target.value)} placeholder={`Broadcast to ${n} terminals...`} className="flex-1 bg-transparent border-none outline-none text-[10px] font-bold text-gray-700" />
          <button type="submit" className="p-1 hover:bg-gray-100 rounded text-gray-400"><Send size={12} /></button>
        </form>
      </div>

      <div className={`flex-1 grid min-h-0 overflow-auto scrollbar-modern ${compactMode ? 'gap-0 p-0' : 'gap-2 p-2 bg-gray-100/30'}`} style={{ gridTemplateColumns: `repeat(${cols}, minmax(min(400px, 100%), 1fr))`, gridAutoRows: rows > 1 ? `calc(${100 / rows}% - ${(rows - 1) * 8 / rows}px)` : '1fr' }}>
        {pIds.map((id) => (
          <div 
            key={id} 
            style={{ contentVisibility: 'auto', containIntrinsicSize: '1px 300px' }}
            className={`group/item bg-white flex flex-col min-w-0 min-h-0 overflow-hidden relative ${compactMode ? 'border-r border-b border-gray-100' : 'rounded-lg border border-gray-100 shadow-sm'}`}
          >
            <button 
              onClick={() => handleRemoveProject(id)}
              className="absolute top-1 right-1 z-50 p-1 bg-white/80 backdrop-blur border border-gray-100 rounded-md text-gray-400 hover:text-red-500 hover:scale-110 opacity-0 group-hover/item:opacity-100 transition-all shadow-sm"
              title="Remove from Overview"
            >
              <X size={12} strokeWidth={3} />
            </button>
            <Terminal projectId={id} />
          </div>
        ))}
      </div>
    </div>
  );
});

TerminalGrid.displayName = 'TerminalGrid';
