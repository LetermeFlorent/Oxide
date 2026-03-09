import { StateCreator } from "zustand";
import { WorkspaceState } from "./config/types";
import { initialState } from "./config/initialState";
import { STORAGE_KEY } from "./config/constants";
import { groupActions } from "./actions/groupActions";
import { overviewActions } from "./actions/overviewActions";
import { projectStoreActions } from "./actions/projectStoreActions";
import * as PM from "./actions/projectManagementActions";
import { projectActions } from "./project/projectActions";
import * as Tree from "./actions/treeActions";
import * as UI from "./actions/uiActions";
import { monitoredInvoke } from "../utils/performance/monitoredInvoke";

export const stateCreator: StateCreator<WorkspaceState, [["zustand/persist", unknown]]> = (set) => ({
  ...initialState as Required<typeof initialState>,
  ...groupActions(set), 
  ...overviewActions(set), 
  ...projectStoreActions(set),
  ...projectActions(set),
  addProject: (p, n, t) => set(PM.addProject(p, n, t) as any),
  addProjects: (i) => set(PM.addProjects(i) as any),
  closeProject: (id) => set(PM.closeProject(id) as any),
  setProjectStatus: (id, s) => set(PM.setProjectStatus(id, s) as any),
  setFollowedFile: (pid, path, pr) => set(PM.setFollowedFile(pid, path, pr) as any),
  setHydrated: (h) => set({ hydrated: h }),
  setTheme: (theme) => set({ theme }),
  setIsDark: (isDark) => set({ isDark }),
  switchProject: (id) => set((s: any) => ({ activeProjectId: id, showSettings: id === 'settings' || s.showSettings })),
  setContextMenu: (m) => set({ contextMenu: m }),
  setRenamingId: (id) => set({ renamingId: id }),
  setTempName: (name) => set({ tempName: name }),
  setShowGroupModal: (show) => set({ showGroupModal: show }),
  setPendingItemId: (id) => set({ pendingItemId: id }),
  setLastDeleted: (d) => set({ lastDeleted: d }),
  setExplorerModal: (m) => set({ explorerModal: m }),
  setColorModal: (m) => set({ colorModal: m }),
  setConfirmModal: (m) => set({ confirmModal: m }),
  setPromptModal: (m) => set({ promptModal: m }),
  applyFilePatch: (pid, p) => set(Tree.applyFilePatch(pid, p) as any),
  updateProjectTree: (id, t, img) => set(Tree.updateProjectTree(id, t, img) as any),
  toggleFolder: (p) => set((s: any) => Tree.toggleFolder(p, s.activeProjectId, monitoredInvoke)(s) as any),
  setViewMode: (v) => set(UI.setViewMode(v) as any),
  setGlobalTabsOrder: (o) => set(UI.setGlobalTabsOrder(o) as any),
  toggleExplorer: () => set(UI.toggleExplorer() as any),
  togglePreview: () => set(UI.togglePreview() as any),
  toggleSearch: () => set(UI.toggleSearch() as any),
  toggleSettings: (sh) => set(UI.toggleSettings(sh) as any),
  toggleOverviewModal: (sh) => set({ showOverviewModal: sh !== undefined ? sh : !(get() as any).showOverviewModal }),
  setSetting: (k, v) => set(UI.setSetting(k, v) as any),
  resetWorkspace: () => { 
    localStorage.removeItem(STORAGE_KEY); 
    localStorage.removeItem('oxide-workspace-storage-v4');
    set({ ...initialState as any, hydrated: true, projects: [], terminalOverviews: [], activeProjectId: null }); 
  },
} as WorkspaceState);
