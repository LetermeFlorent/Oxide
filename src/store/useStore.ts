import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { invoke } from "@tauri-apps/api/core";
import { WorkspaceState } from "./types";
import { stateCreator } from "./stateCreator";

const storage = createJSONStorage(() => ({
  getItem: (name: string) => localStorage.getItem(name),
  removeItem: (name: string) => localStorage.removeItem(name),
  setItem: (name: string, value: string) => {
    if ((window as any)._st) clearTimeout((window as any)._st);
    (window as any)._st = setTimeout(() => {
      invoke("save_workspace", { stateJson: value }).catch(() => {});
      localStorage.setItem(name, value);
    }, 100);
  },
}));

export const useStore = create<WorkspaceState>()(
  persist(stateCreator, {
    name: 'oxide-workspace-storage-v4',
    storage,
    version: 4,
    migrate: (persistedState: any, version: number) => {
      if (version < 4) {
        // Sanitize state: remove any projects/overviews with empty IDs
        if (persistedState && typeof persistedState === 'object') {
          if (Array.isArray(persistedState.projects)) {
            persistedState.projects = persistedState.projects.filter((p: any) => p && p.id && p.id.trim() !== "");
          }
          if (Array.isArray(persistedState.terminalOverviews)) {
            persistedState.terminalOverviews = persistedState.terminalOverviews.filter((o: any) => o && o.id && o.id.trim() !== "");
          }
          if (persistedState.activeProjectId === "") persistedState.activeProjectId = null;
        }
      }
      return persistedState as WorkspaceState;
    },
    partialize: (s) => ({
      projects: (s.reopenLastFiles && s.projects) ? s.projects.map(p => ({
        id: p.id, name: p.name, groupId: s.restoreGroups ? p.groupId : undefined,
        terminalTab: p.terminalTab, selectedFile: p.selectedFile,
                  followedFilePath: s.restoreFollowedFiles ? p.followedFilePath : null,
                  taskProgress: s.restoreFollowedFiles ? p.taskProgress : null, tree: [], isLoading: true,
                })) : [],      activeProjectId: (s.reopenLastFiles && s.restoreActiveTab) ? s.activeProjectId : null,
      showProgressPercentage: s.showProgressPercentage, showProgressBar: s.showProgressBar,
      reopenLastFiles: s.reopenLastFiles, restoreFollowedFiles: s.restoreFollowedFiles,
      restoreGroups: s.restoreGroups, restoreTerminalOverviews: s.restoreTerminalOverviews,
      startOnOverview: s.startOnOverview, restoreActiveTab: s.restoreActiveTab,
      compactMode: s.compactMode, verticalTabs: s.verticalTabs,
      viewMode: s.viewMode, showExplorer: s.showExplorer,
      terminalOverviews: (s.restoreTerminalOverviews && s.terminalOverviews) ? s.terminalOverviews.map(o => ({
        id: o.id, name: o.name, projectIds: o.projectIds, groupId: s.restoreGroups ? o.groupId : undefined
      })) : [],
      groups: s.restoreGroups ? s.groups : [],
      expandedFolders: s.expandedFolders || {},
    }),
    onRehydrateStorage: () => (s) => s?.setHydrated(true)
  })
);
