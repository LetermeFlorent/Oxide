import { WorkspaceState } from "./types";

export const initialState: Partial<WorkspaceState> = {
  projects: [], groups: [], activeProjectId: null, showExplorer: true, showPreview: true,
  showSettings: false, showProgressPercentage: true, showProgressBar: true,
  reopenLastFiles: true, restoreFollowedFiles: true, restoreGroups: true,
  restoreTerminalOverviews: true, startOnOverview: true, restoreActiveTab: true,
  compactMode: false, verticalTabs: false, viewMode: 'preview',
  terminalOverviews: [], expandedFolders: {}, hydrated: false,
  lastDeleted: null, explorerModal: null, confirmModal: null, promptModal: null,
};
