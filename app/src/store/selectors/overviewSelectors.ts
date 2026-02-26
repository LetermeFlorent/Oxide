
import { createSelector } from 'reselect';
import { WorkspaceState } from '../types';
import { getProjects, getActiveProjectId } from './projectSelectors';

export const getOverviews = (s: WorkspaceState) => s.terminalOverviews;
export const getGroups = (s: WorkspaceState) => s.groups;

export const selectActiveOverview = createSelector(
  [getOverviews, getActiveProjectId],
  (ovs, id) => ovs.find(o => o.id === id) || null
);

export const makeSelectOverviewById = (id: string) => createSelector(
  [getOverviews], (ovs) => ovs.find(o => o.id === id) || null
);

export const selectGroupedItems = createSelector(
  [getProjects, getOverviews, getGroups],
  (ps, ovs, gs) => {
    const res: any = { 'ungrouped': { projects: [], overviews: [] } };
    gs.forEach(g => res[g.id] = { projects: [], overviews: [] });
    ps.forEach(p => (p.groupId && res[p.groupId] ? res[p.groupId].projects : res.ungrouped.projects).push(p));
    ovs.forEach(o => (o.groupId && res[o.groupId] ? res[o.groupId].overviews : res.ungrouped.overviews).push(o));
    return res;
  }
);
