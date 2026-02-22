import { memo, useMemo, useCallback } from "react";
import "xterm/css/xterm.css";
import { useTerminal } from "./useTerminal";
import { Terminal as TerminalIcon } from "lucide-react";
import { useStore } from "../../../store/useStore";

/**
 * BashTerminal Component
 * 
 * Redesigned to match the Preview panel style with a top bar and rounded corners.
 * 
 * @param {Object} props - Component props
 * @param {string} props.projectId - Unique identifier for the project
 * @returns {JSX.Element} The terminal interface
 */
export const BashTerminal = memo(({ projectId, suffix = "" }: { projectId: string, suffix?: string }) => {
  const ptyId = useMemo(() => `bash-${projectId.replace(/[^a-zA-Z0-9]/g, '-')}${suffix}`, [projectId, suffix]);
  const isOverview = !!suffix;
  const { ref } = useTerminal(projectId, ptyId, isOverview);
  const compactMode = useStore(s => s.compactMode);

  // Use a targeted selector for Gemini status
  const isGeminiActive = useStore(useCallback(s => {
    const p = s.projects.find(px => px.id === projectId);
    return p?.isGeminiActive || false;
  }, [projectId]));

  return (
    <div className={`flex-1 flex flex-col bg-white overflow-hidden border border-gray-100 min-w-0 ${compactMode ? '' : 'rounded-xl shadow-sm'}`}>
      {/* Terminal Header Bar */}
      <div className="h-8 px-3 flex items-center justify-between shrink-0 border-b border-gray-50 bg-white">
        <div className="flex items-center gap-2 overflow-hidden flex-1">
          <TerminalIcon size={12} className="text-gray-600 shrink-0" />
          <span className="text-[9px] font-black uppercase tracking-widest text-gray-800 shrink-0">Terminal</span>
          <span className="text-[9px] font-black text-gray-500 uppercase truncate tracking-widest ml-2">{projectId}</span>
        </div>
        
        {isGeminiActive && (
          <div className="ml-4 px-2 py-0.5 bg-blue-600 rounded-md text-blue-50 flex items-center gap-1.5 shadow-[0_0_15px_rgba(37,99,235,0.4)] animate-in fade-in slide-in-from-right-4 duration-500 border border-blue-400/30">
            <span className="text-[8px] font-black tracking-[0.2em] uppercase">Gemini</span>
            <span className="flex h-1.5 w-1.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-100 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-100"></span>
            </span>
          </div>
        )}
      </div>
      
      {/* Terminal Area */}
      <div 
        className="flex-1 relative group overflow-hidden cursor-text bg-white outline-none"
        tabIndex={-1}
        onClick={(e) => {
          e.stopPropagation();
          const termElement = ref.current?.querySelector('.xterm-helper-textarea') as HTMLTextAreaElement;
          if (termElement) {
            termElement.focus();
          }
        }}
      >
        <div ref={ref} className="w-full h-full p-4 bg-white [&_.xterm-viewport]:scrollbar-modern-thin pointer-events-auto" />
      </div>
    </div>
  );
});

BashTerminal.displayName = 'BashTerminal';
