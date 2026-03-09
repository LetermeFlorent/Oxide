import { WorkspaceState } from "./types";

export const initialState: Partial<WorkspaceState> = {
  projects: [], groups: [], activeProjectId: null, showExplorer: true, showPreview: true,
  showSettings: false, showSearch: false, showOverviewModal: false, showProgressPercentage: true, showProgressBar: true,
  reopenLastFiles: true, restoreFollowedFiles: true, restoreGroups: true,
  restoreTerminalOverviews: true, startOnOverview: true, restoreActiveTab: true,
  verticalTabs: false, viewMode: 'preview',
  globalTabsOrder: [],
  terminalOverviews: [], expandedFolders: {}, hydrated: false,
  theme: 'auto',
  isDark: false,
  showPerformanceOverlay: false,
  contextMenu: null,
  renamingId: null,
  tempName: "",
  showGroupModal: false,
  pendingItemId: null,
  lastDeleted: null, explorerModal: null, colorModal: null, confirmModal: null, promptModal: null,
};
