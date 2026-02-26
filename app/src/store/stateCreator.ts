
import { StateCreator } from "zustand";
import { WorkspaceState } from "./types";
import { initialState } from "./initialState";
import { groupActions } from "./groupActions";
import { overviewActions } from "./overviewActions";
import { projectActions } from "./project/projectActions";
import { monitoredInvoke } from "../utils/performance";
import * as Tree from "./treeActions";
import * as UI from "./uiActions";
import { STORAGE_KEY } from "./constants";

export const stateCreator: StateCreator<WorkspaceState, [["zustand/persist", unknown]]> = (set) => ({
  ...initialState as Required<typeof initialState>,
  ...groupActions(set), 
  ...overviewActions(set), 
  ...projectActions(set),
  setHydrated: (h) => set({ hydrated: h }),
  switchProject: (id) => set((s: any) => ({ activeProjectId: id, showSettings: id === 'settings' || s.showSettings })),
  setLastDeleted: (d) => set({ lastDeleted: d }),
  setExplorerModal: (m) => set({ explorerModal: m }),
  setConfirmModal: (m) => set({ confirmModal: m }),
  setPromptModal: (m) => set({ promptModal: m }),
  applyFilePatch: (pid, p) => set(Tree.applyFilePatch(pid, p) as any),
  setViewMode: (v) => set(UI.setViewMode(v) as any),
  setGlobalTabsOrder: (o) => set(UI.setGlobalTabsOrder(o) as any),
  toggleExplorer: () => set(UI.toggleExplorer() as any),
  togglePreview: () => set(UI.togglePreview() as any),
  toggleSearch: () => set(UI.toggleSearch() as any),
  toggleSettings: (sh) => set(UI.toggleSettings(sh) as any),
  setSetting: (k, v) => set(UI.setSetting(k, v) as any),
  toggleFolder: (p) => set((s: any) => Tree.toggleFolder(p, s.activeProjectId, monitoredInvoke)(s) as any),
  resetWorkspace: () => { localStorage.removeItem(STORAGE_KEY); set({ ...initialState as any, hydrated: true }); },
} as WorkspaceState);
