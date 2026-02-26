
import { createSelector } from 'reselect';
import { WorkspaceState } from '../types';

export const getShowExplorer = (s: WorkspaceState) => s.showExplorer;
export const getCompactMode = (s: WorkspaceState) => s.compactMode;
export const getViewMode = (s: WorkspaceState) => s.viewMode;

export const selectSettings = createSelector(
  [getShowExplorer, getCompactMode, getViewMode],
  (show, compact, view) => ({ showExplorer: show, compactMode: compact, viewMode: view })
);
