
import { createSelector } from 'reselect';
import { WorkspaceState } from '../config/types';

export const getProjects = (s: WorkspaceState) => s.projects;
export const getActiveProjectId = (s: WorkspaceState) => s.activeProjectId;

export const selectActiveProject = createSelector(
  [getProjects, getActiveProjectId],
  (ps, id) => ps.find(p => p.id === id) || null
);

export const selectCriticalProjects = createSelector(
  [getProjects],
  (ps) => ps.filter(p => p.status === 'intervene').map(p => p.id)
);
