
import { useEffect } from "react";
import { useStore } from "../../store/useStore";

export function useSessionRestoration(hydrated: boolean) {
  // SESSION RESTORATION DISABLED: Prevent automatic scanning of large projects on startup
  useEffect(() => {
    if (hydrated) console.log("Session restoration bypassed for safety. ✨");
  }, [hydrated]);
}

function restoreState(pId: string, pName: string, state: any) {
  try {
    const raw = localStorage.getItem('oxide-workspace-storage-v4');
    const mainState = raw ? JSON.parse(raw)?.state : null;
    if (mainState) {
      const project = (mainState.projects || []).find((x: any) => x.id === pId);
      const overview = (mainState.terminalOverviews || []).find((x: any) => x.id === pId);
      if (project) {
        state.replaceProject(project.id, project.name, project.tree);
        state.updateProject(project.id, { ...project });
      } else if (overview) {
        const linkedProjects = (mainState.projects || []).filter((p: any) => 
          overview.projectIds.includes(p.id)
        );
        state.setProjects(linkedProjects);
        state.setTerminalOverviews([overview]);
      } else if (pId.startsWith('/')) state.replaceProject(pId, pName, []);
    } else if (pId.startsWith('/')) state.replaceProject(pId, pName, []);
  } catch (e) {
    if (pId.startsWith('/')) state.replaceProject(pId, pName, []);
  }
}
