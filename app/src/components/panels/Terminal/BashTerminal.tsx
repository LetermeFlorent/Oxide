
import { memo, useMemo, useCallback } from "react";
import { useTerminal } from "./useTerminal";
import { useStore } from "../../../store/useStore";

import { Terminal as TerminalIcon } from "lucide-react";

export const BashTerminal = memo(({ projectId, sessionId, isDragging }: { projectId: string, sessionId?: string, isDragging?: boolean }) => {
  const activeTerminalId = useStore(useCallback(s => s.projects.find(px => px.id === projectId)?.activeTerminalId || 'bash', [projectId]));
  const targetSessionId = sessionId || activeTerminalId;
  
  const ptyId = useMemo(() => {
    return `bash-${projectId.replace(/[^a-zA-Z0-9]/g, '-')}-${targetSessionId}`;
  }, [projectId, targetSessionId]);
  
  const { ref, term } = useTerminal(projectId, ptyId, false);

  return (
    <div key={ptyId} className="flex-1 flex flex-col bg-panel-bg min-w-0 overflow-hidden">
      <div className="flex-1 relative bg-panel-bg overflow-hidden select-text" onClick={() => !isDragging && setTimeout(() => term?.focus(), 10)}>
        <div ref={ref} className={`absolute inset-0 w-full h-full p-4 transition-opacity duration-200 ${isDragging ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} />
        
        {isDragging && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-foreground/20 animate-pulse">
            <TerminalIcon size={40} strokeWidth={1} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] mt-4">Moving Terminal</span>
          </div>
        )}
      </div>
    </div>
  );
});

BashTerminal.displayName = 'BashTerminal';
