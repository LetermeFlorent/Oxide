
import { memo, useCallback } from "react";
import { useStore } from "../../store/useStore";
import { BashTerminal } from "./Terminal/BashTerminal";
import { TerminalHeader } from "./Terminal/TerminalHeader";

/**
 * Terminal Component
 * 
 * Container component that validates project existence and renders
 * the terminal interface with header and bash shell.
 * 
 * @param {Object} props - Component props
 * @param {string} props.projectId - The project ID (path) to associate with this terminal
 * @returns {JSX.Element} The terminal interface with header and shell
 */
export const Terminal = memo(({ projectId, suffix = "", onDragStart, onRemove }: { projectId: string, suffix?: string, onDragStart?: (e: React.PointerEvent) => void, onRemove?: () => void }) => {
  const compactMode = useStore(s => s.compactMode);
  const exists = useStore(useCallback(s => s.projects.some(p => p.id === projectId), [projectId]));

  if (!projectId) return null;
  if (!exists) {
    return (
      <div className={`flex-1 flex flex-col items-center justify-center bg-gray-50/30 border border-dashed border-gray-200 text-gray-400 ${compactMode ? '' : 'rounded-xl'}`}>
        <span className="text-[10px] font-black uppercase tracking-widest">Loading...</span>
      </div>
    );
  }

  return (
    <div className={`flex-1 flex flex-col bg-white overflow-hidden h-full border-l border-gray-200 ${compactMode ? '' : 'rounded-xl shadow-sm'}`}>
      <TerminalHeader projectId={projectId} onDragStart={onDragStart} onRemove={onRemove} />
      <div className="flex-1 flex flex-col min-h-0 relative">
        <BashTerminal projectId={projectId} suffix={suffix} />
      </div>
    </div>
  );
});

Terminal.displayName = 'Terminal';
