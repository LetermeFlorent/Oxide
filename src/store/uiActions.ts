import { ViewMode, WorkspaceState } from "./types";

export const setViewMode = (v: ViewMode) => () => ({ viewMode: v });

export const toggleExplorer = () => (s: WorkspaceState) => ({ showExplorer: !s.showExplorer });

export const togglePreview = () => (s: WorkspaceState) => ({ showPreview: !s.showPreview });

export const toggleSettings = (sh?: boolean) => (s: WorkspaceState) => {
  const show = sh !== undefined ? sh : !s.showSettings;
  return { 
    showSettings: show,
    activeProjectId: show ? 'settings' : (s.activeProjectId === 'settings' ? (s.projects[0]?.id || s.terminalOverviews[0]?.id || null) : s.activeProjectId)
  };
};

export const setSetting = (k: string, v: boolean) => (s: WorkspaceState) => {
  const n: any = { [k]: v };
  if (k === 'reopenLastFiles' && !v) { n.restoreFollowedFiles = false; n.restoreActiveTab = false; }
  if (k === 'restoreActiveTab' && v && !s.reopenLastFiles) n.reopenLastFiles = true;
  return n;
};
