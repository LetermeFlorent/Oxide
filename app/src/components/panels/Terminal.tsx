
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
export const Terminal = memo(({ projectId, sessionId, onDragStart, onRemove, isDragging }: { projectId: string, sessionId?: string, onDragStart?: (e: React.PointerEvent) => void, onRemove?: () => void, isDragging?: boolean }) => {
  const exists = useStore(useCallback(s => s.projects.some(p => p.id === projectId), [projectId]));

  if (!projectId) return null;
  if (!exists) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-sidebar-bg/30 border border-dashed border-border text-foreground/40 rounded-xl">
        <span className="text-[10px] font-black uppercase tracking-widest">Loading...</span>
      </div>
    );
  }

  return (
    <div className={`flex-1 flex flex-col bg-panel-bg overflow-hidden h-full border-l border-border rounded-xl shadow-sm ${isDragging ? 'opacity-50' : ''}`}>
      <TerminalHeader projectId={projectId} onDragStart={onDragStart} onRemove={onRemove} />
      <div className="flex-1 flex flex-col min-h-0 relative">
        <BashTerminal projectId={projectId} sessionId={sessionId} isDragging={isDragging} />
      </div>
    </div>
  );
});

Terminal.displayName = 'Terminal';
