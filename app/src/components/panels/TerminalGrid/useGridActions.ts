
import { useCallback, useState } from "react";
import { useStore } from "../../../store/useStore";
import { monitoredInvoke } from "../../../utils/performance/monitoredInvoke";

export function useGridActions(overviewId: string, pIds: string[]) {
  const [masterCmd, setMasterCmd] = useState("");
  const setTerminalOverviewProjects = useStore(s => s.setTerminalOverviewProjects);

  const handleBroadcast = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!masterCmd.trim() || !pIds.length) return;
    
    const state = useStore.getState();
    const ids = pIds.map(id => {
      const project = state.projects.find(p => p.id === id);
      const activeId = project?.activeTerminalId || 'bash';
      return `bash-${id.replace(/[^a-zA-Z0-9]/g, '-')}-${activeId}`;
    });
    
    monitoredInvoke("write_to_all_ptys", { ids, data: masterCmd + "\n" });
    setMasterCmd("");
  }, [masterCmd, pIds]);

  const handleRemove = useCallback((projectId: string) => {
    setTerminalOverviewProjects(overviewId, pIds.filter(id => id !== projectId));
  }, [overviewId, pIds, setTerminalOverviewProjects]);

  return { masterCmd, setMasterCmd, handleBroadcast, handleRemove };
}
