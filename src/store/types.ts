export interface FileEntry {
  name: string; path: string; isFolder: boolean; children?: FileEntry[] | null;
}
export type ViewMode = 'preview' | 'code' | 'split';
export type TerminalTab = 'bash';
export type ProjectStatus = 'idle' | 'working' | 'intervene';
export interface ProjectGroup {
  id: string; name: string; collapsed: boolean;
}
export interface ProjectSession {
  id: string; name: string; terminalTab: TerminalTab; status: ProjectStatus;
  selectedFile: FileEntry | null; followedFilePath: string | null;
  taskProgress: number | null; fileContent: string; fileUrl: string | null;
  tree: FileEntry[]; imageFiles?: FileEntry[]; isLoading?: boolean; groupId?: string;
}
export interface TerminalOverview {
  id: string; name: string; projectIds: string[]; groupId?: string;
}
export interface WorkspaceState {
  projects: ProjectSession[]; groups: ProjectGroup[]; activeProjectId: string | null;
  showExplorer: boolean; showPreview: boolean; showSettings: boolean; showProgressPercentage: boolean;
  showProgressBar: boolean; reopenLastFiles: boolean; restoreFollowedFiles: boolean;
  restoreGroups: boolean; restoreTerminalOverviews: boolean; startOnOverview: boolean;
  restoreActiveTab: boolean; compactMode: boolean; verticalTabs: boolean;
  viewMode: ViewMode; terminalOverviews: TerminalOverview[];
  expandedFolders: Record<string, boolean>; hydrated: boolean;
  lastDeleted: { entry: FileEntry, projectId: string, parentPath: string, content?: string } | null;
  explorerModal: { show: boolean, type: 'file' | 'folder', target: FileEntry | null } | null;
  confirmModal: { show: boolean, title: string, message: string, onConfirm: () => void, kind?: 'danger' | 'warning' | 'info' } | null;
  setHydrated: (val: boolean) => void;
  setExplorerModal: (modal: { show: boolean, type: 'file' | 'folder', target: FileEntry | null } | null) => void;
  setConfirmModal: (modal: { show: boolean, title: string, message: string, onConfirm: () => void, kind?: 'danger' | 'warning' | 'info' } | null) => void;
  setLastDeleted: (data: { entry: FileEntry, projectId: string, parentPath: string, content?: string } | null) => void;
  addProject: (path: string, name: string, tree: FileEntry[]) => void;
  addProjects: (items: { path: string, name: string, tree: FileEntry[] }[]) => void;
  replaceProject: (path: string, name: string, tree: FileEntry[]) => void;
  switchProject: (id: string) => void; closeProject: (id: string) => void;
  updateActiveProject: (updates: Partial<ProjectSession>) => void;
  updateProject: (id: string, updates: Partial<ProjectSession>) => void;
  updateProjectTree: (id: string, tree: FileEntry[], imageFiles?: FileEntry[]) => void;
  applyFilePatch: (projectId: string, patch: { parent_path: string, added: FileEntry[], removed: string[] }) => void;
  setProjectStatus: (id: string, status: ProjectStatus) => void;
  setFollowedFile: (projectId: string, path: string | null, progress: number | null) => void;
  setViewMode: (viewMode: ViewMode) => void; toggleExplorer: () => void; togglePreview: () => void;
  toggleSettings: (show?: boolean) => void;
  setSetting: (key: any, value: boolean) => void;
  addTerminalOverview: (name: string, projectIds: string[]) => void;
  updateTerminalOverview: (id: string, name: string) => void;
  setTerminalOverviewProjects: (id: string, projectIds: string[]) => void;
  closeTerminalOverview: (id: string) => void;
  createGroup: (name: string, itemIds?: string[]) => void;
  renameGroup: (id: string, name: string) => void;
  toggleGroup: (id: string) => void; moveToGroup: (itemId: string, groupId: string | null) => void;
  deleteGroup: (id: string) => void; toggleFolder: (path: string) => void;
  setFolderExpanded: (path: string, expanded: boolean) => void;
}
