import { useStore } from "../../../store/useStore";
import { memo, useState } from "react";
import { TerminalSessionsList } from "./components/TerminalSessionsList";
import { TerminalPathInfo } from "./components/TerminalPathInfo";

export const TerminalHeader = memo(({ projectId, onDragStart, onRemove }: { projectId: string, onDragStart?: (e: React.PointerEvent) => void, onRemove?: () => void }) => {
  const p = useStore(s => s.projects.find(px => px.id === projectId));
  const addSession = useStore(s => s.addTerminalSession);
  const switchSession = useStore(s => s.switchTerminalSession);
  const closeSession = useStore(s => s.closeTerminalSession);
  const [isHovered, setIsHovered] = useState(false);
  
  if (!p) return <div className="h-8 bg-gray-50/50 border-b border-gray-100 shrink-0" />;
  const sessions = p.terminalSessions || [{ id: 'bash', name: 'Bash' }];
  const activeId = p.activeTerminalId || sessions[0].id || 'bash';

  return (
    <div onPointerDown={(e: React.PointerEvent) => onDragStart?.(e)} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
      className={`h-8 px-3 flex items-center bg-gray-50/50 border-b border-gray-100 shrink-0 justify-between overflow-hidden group/header ${onDragStart ? 'cursor-grab active:cursor-grabbing' : ''}`}
    >
      <TerminalSessionsList sessions={sessions} activeId={activeId} projectId={projectId} switchSession={switchSession} closeSession={closeSession} addSession={addSession} />
      <TerminalPathInfo p={p} onRemove={onRemove} isHovered={isHovered} />
    </div>
  );
});
TerminalHeader.displayName = 'TerminalHeader';
