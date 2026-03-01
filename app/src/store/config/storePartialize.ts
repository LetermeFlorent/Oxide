
import { WorkspaceState } from "./types";

export const partializeStore = (s: WorkspaceState) => ({
  projects: (s.reopenLastFiles && s.projects) ? s.projects.map(p => ({
    id: p.id, name: p.name, groupId: s.restoreGroups ? p.groupId : undefined,
    terminalTab: p.terminalTab, selectedFile: p.selectedFile,
    followedFilePath: s.restoreFollowedFiles ? p.followedFilePath : null,
    taskProgress: s.restoreFollowedFiles ? p.taskProgress : null, tree: [], isLoading: true,
    terminalSessions: p.terminalSessions, activeTerminalId: p.activeTerminalId
  })) : [], 
  activeProjectId: (s.reopenLastFiles && s.restoreActiveTab) ? s.activeProjectId : null,
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
});
