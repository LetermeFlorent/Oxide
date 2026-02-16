/**
 * @file useStore.ts
 * @description Global state management using Zustand with persistence
 * Manages workspace state including projects, settings, and UI preferences
 * 
 * Features:
 * - Project session management with file trees
 * - Terminal overview grids for multi-project monitoring
 * - Settings persistence with selective serialization
 * - Group management for organizing projects
 * - Folder expansion state tracking
 * 
 * @module store
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { invoke } from "@tauri-apps/api/core";

/**
 * Represents a file or folder entry in the project tree
 * @interface FileEntry
 */
export interface FileEntry {
  /** Display name of the file/folder */
  name: string; 
  /** Absolute path to the file/folder */
  path: string; 
  /** Whether this entry is a directory */
  isFolder: boolean; 
  /** Child entries (for folders) */
  children?: FileEntry[] | null;
}

/** Available view modes for content display */
export type ViewMode = 'preview' | 'code' | 'split';

/** Available terminal tab types */
export type TerminalTab = 'bash';

/** Project status for activity indication */
export type ProjectStatus = 'idle' | 'working' | 'intervene';

/**
 * Represents a group of projects/overviews
 * @interface ProjectGroup
 */
export interface ProjectGroup {
  /** Unique identifier for the group */
  id: string;
  /** Display name of the group */
  name: string;
  /** Whether the group is collapsed in the UI */
  collapsed: boolean;
}

/**
 * Represents an open project session with all its state
 * @interface ProjectSession
 */
export interface ProjectSession {
  /** Unique identifier (project path) */
  id: string; 
  /** Display name of the project */
  name: string;
  /** Currently selected terminal tab */
  terminalTab: TerminalTab;
  /** Current project activity status */
  status: ProjectStatus;
  /** Currently selected file for viewing */
  selectedFile: FileEntry | null;
  /** Path to the file being tracked for task progress */
  followedFilePath: string | null;
  /** Task completion percentage (0-100) */
  taskProgress: number | null;
  /** Content of the currently selected file */
  fileContent: string;
  /** Blob URL for binary files (images/PDFs) */
  fileUrl: string | null;
  /** Project file tree structure */
  tree: FileEntry[];
  /** List of image files in the project */
  imageFiles?: FileEntry[];
  /** Whether the project is currently loading/scanning */
  isLoading?: boolean;
  /** ID of the group this project belongs to */
  groupId?: string;
}

/**
 * Represents a terminal overview grid containing multiple projects
 * @interface TerminalOverview
 */
export interface TerminalOverview {
  /** Unique identifier for the overview */
  id: string;
  /** Display name of the overview */
  name: string;
  /** IDs of projects included in this overview */
  projectIds: string[];
  /** ID of the group this overview belongs to */
  groupId?: string;
}

/**
 * Complete workspace state interface
 * @interface WorkspaceState
 */
interface WorkspaceState {
  /** List of open project sessions */
  projects: ProjectSession[];
  /** List of project groups */
  groups: ProjectGroup[];
  /** Currently active project or overview ID */
  activeProjectId: string | null;
  /** Whether the file explorer sidebar is visible */
  showExplorer: boolean;
  /** Whether the settings modal is open */
  showSettings: boolean;
  /** Whether to show task progress percentage */
  showProgressPercentage: boolean;
  /** Whether to show the progress bar visualization */
  showProgressBar: boolean;
  /** Whether to reopen files from last session */
  reopenLastFiles: boolean;
  /** Whether to restore followed files */
  restoreFollowedFiles: boolean;
  /** Whether to restore project groups */
  restoreGroups: boolean;
  /** Whether to restore terminal overviews */
  restoreTerminalOverviews: boolean;
  /** Whether to start on overview by default */
  startOnOverview: boolean;
  /** Whether to restore the active tab */
  restoreActiveTab: boolean;
  /** Whether compact UI mode is enabled */
  compactMode: boolean;
  /** Whether tabs are displayed vertically */
  verticalTabs: boolean;
  /** Current content view mode */
  viewMode: ViewMode;
  /** List of terminal overviews */
  terminalOverviews: TerminalOverview[];
  /** Map of expanded folder paths */
  expandedFolders: Record<string, boolean>;
  /** Whether persistence has been rehydrated */
  hydrated: boolean;
  /** Set the hydrated state */
  setHydrated: (val: boolean) => void;
  
  /** Add a single project to the workspace */
  addProject: (path: string, name: string, tree: FileEntry[]) => void;
  /** Add multiple projects in batch */
  addProjects: (items: { path: string, name: string, tree: FileEntry[] }[]) => void;
  /** Replace the active project with a new one */
  replaceProject: (path: string, name: string, tree: FileEntry[]) => void;
  /** Switch to a different project/overview */
  switchProject: (id: string) => void;
  /** Close a project and clean up its session */
  closeProject: (id: string) => void;
  /** Update the currently active project */
  updateActiveProject: (updates: Partial<ProjectSession>) => void;
  /** Update any project by ID */
  updateProject: (id: string, updates: Partial<ProjectSession>) => void;
  /** Update a project's file tree */
  updateProjectTree: (id: string, tree: FileEntry[], imageFiles?: FileEntry[]) => void;
  /** Set a project's status */
  setProjectStatus: (id: string, status: ProjectStatus) => void;
  /** Set or clear the followed file for a project */
  setFollowedFile: (projectId: string, path: string | null, progress: number | null) => void;
  /** Change the view mode */
  setViewMode: (viewMode: ViewMode) => void;
  /** Toggle explorer visibility */
  toggleExplorer: () => void;
  /** Toggle settings modal */
  toggleSettings: (show?: boolean) => void;
  /** Update a boolean setting */
  setSetting: (key: 'showProgressPercentage' | 'showProgressBar' | 'reopenLastFiles' | 'restoreFollowedFiles' | 'restoreGroups' | 'restoreTerminalOverviews' | 'startOnOverview' | 'restoreActiveTab' | 'compactMode' | 'verticalTabs', value: boolean) => void;
  /** Create a new terminal overview */
  addTerminalOverview: (name: string, projectIds: string[]) => void;
  /** Rename a terminal overview */
  updateTerminalOverview: (id: string, name: string) => void;
  /** Set the projects included in an overview */
  setTerminalOverviewProjects: (id: string, projectIds: string[]) => void;
  /** Close and remove a terminal overview */
  closeTerminalOverview: (id: string) => void;
  /** Create a new project group */
  createGroup: (name: string, itemIds?: string[]) => void;
  /** Rename a group */
  renameGroup: (id: string, name: string) => void;
  /** Toggle group collapse state */
  toggleGroup: (id: string) => void;
  /** Move an item to a group (or remove from group) */
  moveToGroup: (itemId: string, groupId: string | null) => void;
  /** Delete a group */
  deleteGroup: (id: string) => void;
  /** Toggle folder expansion state */
  toggleFolder: (path: string) => void;
}

export const useStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      projects: [],
      groups: [],
      activeProjectId: null,
      showExplorer: true,
      showSettings: false,
      showProgressPercentage: true,
      showProgressBar: true,
      reopenLastFiles: true,
      restoreFollowedFiles: true,
      restoreGroups: true,
      restoreTerminalOverviews: true,
      startOnOverview: true,
      restoreActiveTab: true,
      compactMode: false,
      verticalTabs: false,
      viewMode: 'preview',
      terminalOverviews: [],
      expandedFolders: {},
      hydrated: false,
      setHydrated: (hydrated) => set({ hydrated }),
      
      addProject: (path, name, tree) => set((state) => {
        const existing = state.projects.find(p => p.id === path);
        if (existing) return { activeProjectId: path, showSettings: false };
        const taskFile = (tree || []).find(f => !f.isFolder && (f.name.toLowerCase() === 'task.md' || f.name.toLowerCase() === 'tasks.md'));
        const newProject: ProjectSession = {
          id: path, name, terminalTab: 'bash', status: 'idle', selectedFile: null, 
          followedFilePath: taskFile ? taskFile.path : null, taskProgress: null,
          fileContent: '', fileUrl: null, tree: tree || [], isLoading: !tree || tree.length === 0
        };
        return { projects: [...state.projects, newProject], activeProjectId: path, showSettings: false };
      }),

      addProjects: (items) => set((state) => {
        const newProjects: ProjectSession[] = [];
        let firstNewId: string | null = null;
        for (const item of items) {
          if (state.projects.find(p => p.id === item.path)) continue;
          const taskFile = (item.tree || []).find(f => !f.isFolder && (f.name.toLowerCase() === 'task.md' || f.name.toLowerCase() === 'tasks.md'));
          const newProject: ProjectSession = {
            id: item.path, name: item.name, terminalTab: 'bash', status: 'idle', selectedFile: null, 
            followedFilePath: taskFile ? taskFile.path : null, taskProgress: null,
            fileContent: '', fileUrl: null, tree: item.tree || [], isLoading: !item.tree || item.tree.length === 0
          };
          newProjects.push(newProject);
          if (!firstNewId) firstNewId = item.path;
        }
        if (newProjects.length === 0) return {};
        return { projects: [...state.projects, ...newProjects], activeProjectId: state.activeProjectId || firstNewId, showSettings: false };
      }),

      switchProject: (id) => set({ activeProjectId: id, showSettings: false }),

      closeProject: (id) => set((state) => {
        const next = state.projects.filter(p => p.id !== id);
        let nextActiveId = state.activeProjectId;
        if (state.activeProjectId === id) nextActiveId = next[next.length-1]?.id || state.terminalOverviews[0]?.id || null;
        return { projects: next, activeProjectId: nextActiveId, showSettings: (next.length === 0 && state.terminalOverviews.length === 0) ? state.showSettings : false };
      }),

      toggleSettings: (show) => set((s) => ({ showSettings: show !== undefined ? show : !s.showSettings })),

      setSetting: (key, value) => set((s) => {
        const next: any = { [key]: value };
        if (key === 'reopenLastFiles' && !value) { next.restoreFollowedFiles = false; next.restoreActiveTab = false; }
        if (key === 'restoreActiveTab' && value && !s.reopenLastFiles) { next.reopenLastFiles = true; }
        return next;
      }),

      replaceProject: (path, name, tree) => set((state) => {
        const taskFile = (tree || []).find(f => !f.isFolder && (f.name.toLowerCase() === 'task.md' || f.name.toLowerCase() === 'tasks.md'));
        const newProject: ProjectSession = {
          id: path, name, terminalTab: 'bash', status: 'idle', selectedFile: null, 
          followedFilePath: taskFile ? taskFile.path : null, taskProgress: null,
          fileContent: '', fileUrl: null, tree: tree || [], isLoading: !tree || tree.length === 0
        };
        if (!state.activeProjectId) return { projects: [newProject], activeProjectId: path, showSettings: false };
        return { projects: state.projects.map(p => p.id === state.activeProjectId ? newProject : p), activeProjectId: path, showSettings: false };
      }),

      updateActiveProject: (upd) => set((s) => ({ projects: s.projects.map(p => p.id === s.activeProjectId ? { ...p, ...upd } : p) })),
      updateProject: (id, upd) => set((s) => ({ projects: s.projects.map(p => p.id === id ? { ...p, ...upd } : p) })),
      
      updateProjectTree: (id, tree, imageFiles) => set((s) => ({
        projects: s.projects.map(p => p.id === id ? { ...p, tree: tree || [], imageFiles: imageFiles || [], isLoading: false } : p)
      })),

      setProjectStatus: (id, status) => set((s) => ({ projects: s.projects.map(p => p.id === id ? { ...p, status } : p) })),
      setFollowedFile: (projectId, path, taskProgress) => set((s) => ({ projects: s.projects.map(p => p.id === projectId ? { ...p, followedFilePath: path, taskProgress } : p) })),
      setViewMode: (viewMode) => set({ viewMode }),
      toggleExplorer: () => set((s) => ({ showExplorer: !s.showExplorer })),

      addTerminalOverview: (name, projectIds) => set((s) => {
        const id = `overview-${Date.now()}`;
        return { terminalOverviews: [...s.terminalOverviews, { id, name, projectIds: projectIds || [] }], activeProjectId: id };
      }),

      updateTerminalOverview: (id, name) => set((s) => ({ terminalOverviews: s.terminalOverviews.map(o => o.id === id ? { ...o, name } : o) })),
      setTerminalOverviewProjects: (id, projectIds) => set((s) => ({ terminalOverviews: s.terminalOverviews.map(o => o.id === id ? { ...o, projectIds: projectIds || [] } : o) })),
      closeTerminalOverview: (id) => set((s) => {
        const next = s.terminalOverviews.filter(o => o.id !== id);
        let nextActiveId = s.activeProjectId;
        if (s.activeProjectId === id) nextActiveId = s.projects[0]?.id || next[0]?.id || null;
        return { terminalOverviews: next, activeProjectId: nextActiveId };
      }),

      createGroup: (name, itemIds) => set((s) => {
        const id = `group-${Date.now()}`;
        const newGroup = { id, name, collapsed: false };
        return {
          groups: [...(s.groups || []), newGroup],
          projects: s.projects.map(p => itemIds?.includes(p.id) ? { ...p, groupId: id } : p),
          terminalOverviews: s.terminalOverviews.map(o => itemIds?.includes(o.id) ? { ...o, groupId: id } : o)
        };
      }),

      renameGroup: (id, name) => set((s) => ({ groups: s.groups.map(g => g.id === id ? { ...g, name } : g) })),
      toggleGroup: (id) => set((s) => ({ groups: s.groups.map(g => g.id === id ? { ...g, collapsed: !g.collapsed } : g) })),
      moveToGroup: (itemId, groupId) => set((s) => ({
        projects: s.projects.map(p => p.id === itemId ? { ...p, groupId: groupId || undefined } : p),
        terminalOverviews: s.terminalOverviews.map(o => o.id === itemId ? { ...o, groupId: groupId || undefined } : o)
      })),
      deleteGroup: (id) => set((s) => ({
        groups: s.groups.filter(g => g.id !== id),
        projects: s.projects.map(p => p.groupId === id ? { ...p, groupId: undefined } : p),
        terminalOverviews: s.terminalOverviews.map(o => o.groupId === id ? { ...o, groupId: undefined } : o)
      })),
      toggleFolder: (path) => set((s) => ({ expandedFolders: { ...s.expandedFolders, [path]: !s.expandedFolders[path] } })),
    }),
    {
      name: 'oxide-workspace-storage-v1',
      storage: createJSONStorage(() => ({
        getItem: (name) => localStorage.getItem(name),
        setItem: (name, value) => {
          const throttle = (window as any)._storageThrottle;
          if (throttle) clearTimeout(throttle);
          (window as any)._storageThrottle = setTimeout(() => {
            // NATIVE RUST SAVE (ASYNC)
            invoke("save_workspace", { stateJson: value }).catch(() => {});
            localStorage.setItem(name, value);
          }, 100);
        },
        removeItem: (name) => localStorage.removeItem(name),
      })),
      partialize: (state) => ({
        projects: (state.reopenLastFiles && Array.isArray(state.projects)) ? state.projects.map(p => ({
          id: p.id, name: p.name, groupId: state.restoreGroups ? p.groupId : undefined,
          terminalTab: p.terminalTab, selectedFile: p.selectedFile,
          followedFilePath: state.restoreFollowedFiles ? p.followedFilePath : null,
          taskProgress: state.restoreFollowedFiles ? p.taskProgress : null,
          tree: [], 
        })) : [],
        activeProjectId: (state.reopenLastFiles && state.restoreActiveTab) ? state.activeProjectId : null,
        showProgressPercentage: state.showProgressPercentage, showProgressBar: state.showProgressBar,
        reopenLastFiles: state.reopenLastFiles, restoreFollowedFiles: state.restoreFollowedFiles,
        restoreGroups: state.restoreGroups, restoreTerminalOverviews: state.restoreTerminalOverviews,
        startOnOverview: state.startOnOverview, restoreActiveTab: state.restoreActiveTab,
        compactMode: state.compactMode, verticalTabs: state.verticalTabs,
        viewMode: state.viewMode, showExplorer: state.showExplorer,
        terminalOverviews: (state.restoreTerminalOverviews && Array.isArray(state.terminalOverviews)) ? state.terminalOverviews.map(o => ({
          id: o.id, name: o.name, projectIds: o.projectIds, groupId: state.restoreGroups ? o.groupId : undefined
        })) : [],
        groups: (state.restoreGroups && Array.isArray(state.groups)) ? state.groups : [],
        expandedFolders: state.expandedFolders || {},
      }),
      onRehydrateStorage: () => (state) => { state?.setHydrated(true); }
    }
  )
);
