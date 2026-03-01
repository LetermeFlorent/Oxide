
import { useCallback } from "react";
import { useStore } from "../../store/useStore";
import { monitoredInvoke } from "../../utils/performance/monitoredInvoke";

export function useOxideCommand() {
  const setStatus = useStore(s => s.setProjectStatus);
  const activeProjectId = useStore(s => s.activeProjectId);

  return useCallback(async <T>(command: string, args?: any, projectId?: string): Promise<T | null> => {
    const id = projectId || activeProjectId;
    if (id) setStatus(id, 'working');
    
    try {
      const result = await monitoredInvoke<T>(command, args);
      return result;
    } catch (err) {
      
      return null;
    } finally {
      if (id) setStatus(id, 'idle');
    }
  }, [activeProjectId, setStatus]);
}
