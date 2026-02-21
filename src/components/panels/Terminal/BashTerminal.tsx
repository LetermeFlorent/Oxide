import { memo, useMemo } from "react";
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
export const BashTerminal = memo(({ projectId }: { projectId: string }) => {
  const ptyId = useMemo(() => `bash-${projectId.replace(/[^a-zA-Z0-9]/g, '-')}`, [projectId]);
  const { ref } = useTerminal(projectId, ptyId);
  const compactMode = useStore(s => s.compactMode);

  return (
    <div className={`flex-1 flex flex-col bg-white overflow-hidden border border-gray-100 min-w-0 ${compactMode ? '' : 'rounded-xl shadow-sm'}`}>
      {/* Terminal Header Bar */}
      <div className="h-8 px-3 flex items-center justify-between shrink-0 border-b border-gray-50 bg-white">
        <div className="flex items-center gap-2">
          <TerminalIcon size={12} className="text-gray-600" />
          <span className="text-[9px] font-black uppercase tracking-widest text-gray-800">Terminal</span>
        </div>
        <div className="flex items-center gap-2 max-w-[70%]">
          <span className="text-[8px] font-bold text-gray-300 uppercase truncate tracking-widest">{projectId}</span>
        </div>
      </div>
      
      {/* Terminal Area */}
      <div 
        className="flex-1 relative group overflow-hidden cursor-text bg-white"
        onClick={() => {
          const termElement = ref.current?.querySelector('.xterm-helper-textarea') as HTMLTextAreaElement;
          termElement?.focus();
        }}
      >
        <div ref={ref} className="w-full h-full p-4 bg-white [&_.xterm-viewport]:scrollbar-modern-thin" />
      </div>
    </div>
  );
});

BashTerminal.displayName = 'BashTerminal';
