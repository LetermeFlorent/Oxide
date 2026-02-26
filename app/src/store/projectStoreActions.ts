
import { monitoredInvoke } from "../utils/performance";

export const projectStoreActions = (set: any) => ({
  updateActiveProject: (u: any) => set((s: any) => ({ projects: s.projects.map((p: any) => p.id === s.activeProjectId ? { ...p, ...u } : p) })),
  updateProject: (id: string, u: any) => set((s: any) => ({ projects: s.projects.map((p: any) => p.id === id ? { ...p, ...u } : p) })),
  setFolderExpanded: (p: string, e: boolean) => set((s: any) => {
    if (s.activeProjectId) {
      if (e) monitoredInvoke("watch_folder", { id: s.activeProjectId, path: p }).catch(() => {});
      else monitoredInvoke("unwatch_folder", { id: s.activeProjectId, path: p }).catch(() => {});
    }
    return { expandedFolders: { ...s.expandedFolders, [p]: e } };
  }),
});
