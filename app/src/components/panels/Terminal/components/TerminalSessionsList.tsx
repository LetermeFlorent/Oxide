
import { Plus, Terminal as TerminalIcon, X } from "lucide-react";
import { TerminalTab } from "./TerminalTab";

export const TerminalSessionsList = ({ sessions, activeId, projectId, switchSession, closeSession, addSession }: any) => (
  <div className="flex items-center gap-1 h-full overflow-x-auto scrollbar-modern-thin min-w-0 flex-1 mr-4">
    {sessions.map((s: any) => (
      <div key={s.id} className="flex items-center h-full group relative shrink-0">
        <TerminalTab active={activeId === s.id} onClick={() => switchSession(projectId, s.id)} icon={TerminalIcon} label={s.name || 'Bash'} activeClass="text-black border-black" />
        {sessions.length > 1 && (
          <button type="button" onClick={(e) => { e.stopPropagation(); closeSession(projectId, s.id); }} className={`ml-1 p-0.5 rounded-full hover:bg-gray-200 text-gray-400 hover:text-red-500 transition-all ${activeId === s.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}><X size={8} /></button>
        )}
        <div className="w-2" />
      </div>
    ))}
        <button type="button" onClick={(e: React.MouseEvent) => { e.stopPropagation(); addSession(projectId); }} className="p-1 rounded-md hover:bg-gray-200 text-gray-500 transition-colors ml-1 shrink-0" title="Add Terminal"><Plus size={10} /></button>
  </div>
);
