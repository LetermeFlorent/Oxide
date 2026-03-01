import { useCallback, useRef } from "react";
import { useStore } from "../../store/useStore";
import { useOxideCommand } from "../state/useOxideCommand";

export function useFileSaving() {
  const activeProjectId = useStore(s => s.activeProjectId);
  const activeProject = useStore(s => s.projects.find(p => p.id === activeProjectId));
  const updateActiveProject = useStore(s => s.updateActiveProject);
  const execute = useOxideCommand();
  const timeoutRef = useRef<any>(null);

  return useCallback(async (content: string) => {
    const path = activeProject?.selectedFile?.path;
    if (!path) return;
    
    updateActiveProject({ fileContent: content });
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    timeoutRef.current = setTimeout(async () => {
      await execute("write_text_file", { path, content });
    }, 500);
  }, [activeProject, updateActiveProject, execute]);
}
