import { createSelector } from 'reselect';
import { WorkspaceState, ProjectSession, TerminalOverview } from './types';

// Root selectors
const getProjects = (state: WorkspaceState) => state.projects;
const getActiveProjectId = (state: WorkspaceState) => state.activeProjectId;
const getGroups = (state: WorkspaceState) => state.groups;
const getTerminalOverviews = (state: WorkspaceState) => state.terminalOverviews;
const getShowExplorer = (state: WorkspaceState) => state.showExplorer;
const getCompactMode = (state: WorkspaceState) => state.compactMode;
const getViewMode = (state: WorkspaceState) => state.viewMode;

/**
 * Selects the active project session based on the current activeProjectId.
 */
export const selectActiveProject = createSelector(
  [getProjects, getActiveProjectId],
  (projects, activeId) => projects.find(p => p.id === activeId) || null
);

/**
 * Selects the active terminal overview based on the current activeProjectId.
 */
export const selectActiveOverview = createSelector(
  [getTerminalOverviews, getActiveProjectId],
  (overviews, activeId) => overviews.find(o => o.id === activeId) || null
);

/**
 * Factory selector for getting an overview by ID
 */
export const makeSelectOverviewById = (id: string) => createSelector(
  [getTerminalOverviews],
  (overviews) => overviews.find(o => o.id === id) || null
);

/**
 * Returns a list of project IDs that are currently in an 'intervene' state.
 */
export const selectCriticalProjects = createSelector(
  [getProjects],
  (projects) => projects.filter(p => p.status === 'intervene').map(p => p.id)
);

/**
 * Groups projects and terminal overviews by their group ID.
 * Returns an object where keys are groupId (or 'ungrouped') and values are the items.
 */
export const selectGroupedItems = createSelector(
  [getProjects, getTerminalOverviews, getGroups],
  (projects, overviews, groups) => {
    const grouped: Record<string, { projects: ProjectSession[], overviews: TerminalOverview[] }> = {
      'ungrouped': { projects: [], overviews: [] }
    };
    
    groups.forEach(g => {
      grouped[g.id] = { projects: [], overviews: [] };
    });
    
    projects.forEach(p => {
      if (p.groupId && grouped[p.groupId]) {
        grouped[p.groupId].projects.push(p);
      } else {
        grouped['ungrouped'].projects.push(p);
      }
    });
    
    overviews.forEach(o => {
      if (o.groupId && grouped[o.groupId]) {
        grouped[o.groupId].overviews.push(o);
      } else {
        grouped['ungrouped'].overviews.push(o);
      }
    });
    
    return grouped;
  }
);

/**
 * Helper to get simple values
 */
export const selectSettings = createSelector(
  [getShowExplorer, getCompactMode, getViewMode],
  (showExplorer, compactMode, viewMode) => ({ showExplorer, compactMode, viewMode })
);
