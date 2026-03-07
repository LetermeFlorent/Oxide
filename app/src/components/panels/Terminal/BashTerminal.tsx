
import { memo, useMemo, useCallback } from "react";
import { useTerminal } from "./useTerminal";
import { useStore } from "../../../store/useStore";

export const BashTerminal = memo(({ projectId, sessionId }: { projectId: string, sessionId?: string }) => {
  const activeTerminalId = useStore(useCallback(s => s.projects.find(px => px.id === projectId)?.activeTerminalId || 'bash', [projectId]));
  const targetSessionId = sessionId || activeTerminalId;
  
  const ptyId = useMemo(() => {
    return `bash-${projectId.replace(/[^a-zA-Z0-9]/g, '-')}-${targetSessionId}`;
  }, [projectId, targetSessionId]);
  
  const { ref, term } = useTerminal(projectId, ptyId, false);

  return (
    <div key={ptyId} className="flex-1 flex flex-col bg-panel-bg min-w-0 overflow-hidden">
      <div className="flex-1 relative bg-panel-bg overflow-hidden select-text" onClick={() => setTimeout(() => term?.focus(), 10)}>
        <div ref={ref} className="absolute inset-0 w-full h-full p-4" />
      </div>
    </div>
  );
});

BashTerminal.displayName = 'BashTerminal';
