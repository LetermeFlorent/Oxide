import { StateCreator } from "zustand";
import { ProjectStatus, ViewMode, WorkspaceState } from "./types";
import { initialState } from "./initialState";
import { createProject } from "./projectActions";
import { groupActions } from "./groupActions";
import { monitoredInvoke } from "../utils/performance";
import * as TreeActions from "./treeActions";
import * as ProjectManagementActions from "./projectManagementActions";
import * as UIActions from "./uiActions";

export const stateCreator: StateCreator<WorkspaceState, [["zustand/persist", unknown]]> = (set) => ({
  ...initialState as Required<typeof initialState>,
  ...groupActions(set),
  setHydrated: (h: boolean) => set({ hydrated: h }),
  
  // Project Management
  addProject: (pa: string, n: string, t: any) => set(ProjectManagementActions.addProject(pa, n, t) as any),
  addProjects: (it: any[]) => set(ProjectManagementActions.addProjects(it) as any),
  switchProject: (id: string) => set((s: any) => ({ 
    activeProjectId: id, 
    showSettings: id === 'settings' ? true : s.showSettings 
  })),
  closeProject: (id: string) => set(ProjectManagementActions.closeProject(id) as any),
  replaceProject: (pa: string, n: string, t: any) => set((s: any) => {
    const p = createProject(pa, n, t);
    return !s.activeProjectId ? { projects: [p], activeProjectId: pa, showSettings: false } : { projects: s.projects.map((pr: any) => pr.id === s.activeProjectId ? p : pr), activeProjectId: pa, showSettings: false };
  }),
  updateActiveProject: (u: any) => set((s: any) => ({ projects: s.projects.map((p: any) => p.id === s.activeProjectId ? { ...p, ...u } : p) })),
  updateProject: (id: string, u: any) => set((s: any) => ({ projects: s.projects.map((p: any) => p.id === id ? { ...p, ...u } : p) })),
  
  setLastDeleted: (d: any) => set({ lastDeleted: d }),
  setExplorerModal: (m: any) => set({ explorerModal: m }),
  setConfirmModal: (m: any) => set({ confirmModal: m }),
  
  // Tree & Sync
  updateProjectTree: (id: string, t: any, i: any) => set(TreeActions.updateProjectTree(id, t, i) as any),
  applyFilePatch: (projectId: string, patch: any) => set(TreeActions.applyFilePatch(projectId, patch) as any),
  setProjectStatus: (id: string, st: ProjectStatus) => set(ProjectManagementActions.setProjectStatus(id, st) as any),
  setFollowedFile: (pid: string, pa: any, pr: any) => set(ProjectManagementActions.setFollowedFile(pid, pa, pr) as any),
  
  // UI Actions
  setViewMode: (v: ViewMode) => set(UIActions.setViewMode(v) as any),
  toggleExplorer: () => set(UIActions.toggleExplorer() as any),
  togglePreview: () => set(UIActions.togglePreview() as any),
  toggleSettings: (sh?: boolean) => set(UIActions.toggleSettings(sh) as any),
  setSetting: (k: string, v: boolean) => set(UIActions.setSetting(k, v) as any),
  
  // Terminal Overviews
  addTerminalOverview: (n: string, ps: string[]) => set((s: any) => {
    const id = `ov-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    return { terminalOverviews: [...s.terminalOverviews, { id, name: n, projectIds: ps || [] }], activeProjectId: id };
  }),
  updateTerminalOverview: (id: string, n: string) => set((s: any) => ({ terminalOverviews: s.terminalOverviews.map((o: any) => o.id === id ? { ...o, name: n } : o) })),
  setTerminalOverviewProjects: (id: string, ps: string[]) => set((s: any) => ({ terminalOverviews: s.terminalOverviews.map((o: any) => o.id === id ? { ...o, projectIds: ps || [] } : o) })),
  closeTerminalOverview: (id: string) => set((s: any) => {
    const next = s.terminalOverviews.filter((o: any) => o.id !== id);
    return { terminalOverviews: next, activeProjectId: s.activeProjectId === id ? (s.projects[0]?.id || next[0]?.id || null) : s.activeProjectId };
  }),
  
  toggleFolder: (p: string) => set((s: any) => TreeActions.toggleFolder(p, s.activeProjectId, monitoredInvoke)(s) as any),
  setFolderExpanded: (p: string, e: boolean) => set((s: any) => {
    if (s.activeProjectId) {
      if (e) monitoredInvoke("watch_folder", { id: s.activeProjectId, path: p }).catch(console.error);
      else monitoredInvoke("unwatch_folder", { id: s.activeProjectId, path: p }).catch(console.error);
    }
    return { expandedFolders: { ...s.expandedFolders, [p]: e } };
  }),
  
  resetWorkspace: () => {
    localStorage.removeItem('oxide-workspace-storage-v4');
    set({ ...initialState as any, hydrated: true });
  },
} as WorkspaceState);
