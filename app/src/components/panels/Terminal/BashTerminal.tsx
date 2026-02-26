
import { memo, useMemo, useCallback } from "react";
import { useTerminal } from "./useTerminal";
import { Terminal as TerminalIcon } from "lucide-react";
import { useStore } from "../../../store/useStore";
import { GeminiIndicator } from "./GeminiIndicator";
import { PanelHeader } from "../../ui/PanelHeader";

export const BashTerminal = memo(({ projectId, suffix = "" }: { projectId: string, suffix?: string }) => {
  const activeTerminalId = useStore(useCallback(s => s.projects.find(px => px.id === projectId)?.activeTerminalId || 'bash', [projectId]));
  const ptyId = useMemo(() => {
    if (suffix) return `bash-${projectId.replace(/[^a-zA-Z0-9]/g, '-')}${suffix}`;
    return `bash-${projectId.replace(/[^a-zA-Z0-9]/g, '-')}-${activeTerminalId}`;
  }, [projectId, suffix, activeTerminalId]);
  
  const { ref, term } = useTerminal(projectId, ptyId, !!suffix);

  return (
    <div key={ptyId} className="flex-1 flex flex-col bg-white min-w-0 overflow-hidden">
      <div className="flex-1 relative bg-white overflow-hidden select-text" onClick={() => setTimeout(() => term?.focus(), 10)}>
        <div ref={ref} className="absolute inset-0 w-full h-full p-4" />
      </div>
    </div>
  );
});

BashTerminal.displayName = 'BashTerminal';
