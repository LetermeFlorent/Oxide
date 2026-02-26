import { ViewMode, WorkspaceState } from "./types";

export const setViewMode = (v: ViewMode) => () => ({ viewMode: v });

export const setGlobalTabsOrder = (order: string[]) => () => ({ globalTabsOrder: order });

export const toggleExplorer = () => (s: WorkspaceState) => ({ showExplorer: !s.showExplorer, showSearch: false });

export const togglePreview = () => (s: WorkspaceState) => ({ showPreview: !s.showPreview });

export const toggleSearch = () => (s: WorkspaceState) => ({ showSearch: !s.showSearch, showExplorer: false });

export const toggleSettings = (sh?: boolean) => (s: WorkspaceState) => ({
  showSettings: sh !== undefined ? sh : !s.showSettings
});

export const setSetting = (k: string, v: boolean) => (s: WorkspaceState) => {
  const n: any = { [k]: v };
  if (k === 'reopenLastFiles' && !v) { n.restoreFollowedFiles = false; n.restoreActiveTab = false; }
  if (k === 'restoreActiveTab' && v && !s.reopenLastFiles) n.reopenLastFiles = true;
  return n;
};
