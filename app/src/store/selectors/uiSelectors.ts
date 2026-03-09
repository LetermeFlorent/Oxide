
import { createSelector } from 'reselect';
import { WorkspaceState } from '../config/types';

export const getShowExplorer = (s: WorkspaceState) => s.showExplorer;
export const getViewMode = (s: WorkspaceState) => s.viewMode;

export const selectSettings = createSelector(
  [getShowExplorer, getViewMode],
  (show, view) => ({ showExplorer: show, viewMode: view })
);
