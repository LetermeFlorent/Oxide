
import { useState, useMemo } from "react";
import { useStore } from "../../../store/useStore";
import { t } from "../../../i18n";
import { useTabRenaming } from "./useTabRenaming";
import { useTabGroups } from "./useTabGroups";

export function useProjectTabs() {
  const s = useStore();
  const { renamingId, setRenamingId, tempName, setTempName, submitRename: originalSubmitRename } = useTabRenaming(s.terminalOverviews, s.updateProject, s.updateTerminalOverview);
  
  const submitRename = () => {
    const item = s.groups.find(g => g.id === renamingId);
    if (item) {
      s.renameGroup(renamingId!, tempName);
      setRenamingId(null);
    } else {
      originalSubmitRename();
    }
  };

  const { showGroupModal, setShowGroupModal, newGroupName, setNewGroupName, setPendingItemId, showCloseModal, setShowCloseModal, selectedCloseIds, setSelectedCloseIds, handleCreateGroup, handleCloseSelected } = useTabGroups(s.createGroup, s.terminalOverviews, s.closeProject, s.closeTerminalOverview);
  const [contextMenu, setContextMenu] = useState<any>(null);
  const [showEditOverviewModal, setShowEditOverviewModal] = useState(false);
  const [editingOverviewId, setEditingOverviewId] = useState<string | null>(null);
  const [editingProjectIds, setEditingProjectIds] = useState<string[]>([]);

  const allTabs = useMemo(() => {
    const tabsMap = new Map<string, any>();

    // 1. Ajouter les Groupes
    s.groups.forEach(g => {
      tabsMap.set(g.id, { id: g.id, name: g.name, type: 'group' as const, data: g });
    });

    // 2. Ajouter les Overviews (non groupées)
    s.terminalOverviews.filter(o => !o.groupId).forEach(o => {
      const id = o.id?.trim();
      if (id) tabsMap.set(id, { id, name: o.name, type: 'overview' as const });
    });

    // 3. Ajouter les Projets (non groupés)
    s.projects.filter(p => !p.groupId).forEach(p => {
      const id = p.id?.trim();
      if (id) tabsMap.set(id, { id, name: p.name, type: 'project' as const });
    });
    
    const uniqueTabs = Array.from(tabsMap.values());

    // 5. Trier
    const cleanOrder = Array.from(new Set((s.globalTabsOrder || []).filter(id => !!id?.trim())));
    if (cleanOrder.length > 0) {
      const orderMap = new Map(cleanOrder.map((id, i) => [id, i]));
      uniqueTabs.sort((a, b) => {
        const aIdx = orderMap.has(a.id) ? orderMap.get(a.id)! : 9999;
        const bIdx = orderMap.has(b.id) ? orderMap.get(b.id)! : 9999;
        return aIdx - bIdx;
      });
    }

    return uniqueTabs;
  }, [s.projects, s.terminalOverviews, s.groups, s.showSettings, s.activeProjectId, s.globalTabsOrder]);

  const handleOpenEditOverview = (id: string) => {
    const o = s.terminalOverviews.find(ov => ov.id === id);
    if (o) { setEditingOverviewId(id); setEditingProjectIds(o.projectIds); setShowEditOverviewModal(true); }
  };

  return {
    projects: s.projects, terminalOverviews: s.terminalOverviews, groups: s.groups, activeProjectId: s.activeProjectId, allTabs, renamingId, tempName, setTempName, contextMenu, setContextMenu,
    showEditOverviewModal, setShowEditOverviewModal, editingOverviewId, editingProjectIds, setEditingProjectIds, showGroupModal, setShowGroupModal, newGroupName, setNewGroupName, showCloseModal, setShowCloseModal, selectedCloseIds, setSelectedCloseIds,
    switchProject: s.switchProject, closeProject: s.closeProject, closeTerminalOverview: s.closeTerminalOverview, updateProject: s.updateProject, updateTerminalOverview: s.updateTerminalOverview, 
    deleteGroup: s.deleteGroup, toggleGroup: s.toggleGroup, moveToGroup: s.moveToGroup, createGroup: s.createGroup, setProjects: s.setProjects, setTerminalOverviews: s.setTerminalOverviews,
    setGlobalTabsOrder: s.setGlobalTabsOrder,
    reorderUngroupedProjects: (newUngrouped: any[]) => s.setProjects([...s.projects.filter(p => p.groupId), ...newUngrouped]),
    reorderUngroupedOverviews: (newUngrouped: any[]) => s.setTerminalOverviews([...s.terminalOverviews.filter(o => o.groupId), ...newUngrouped]),
    reorderGroupProjects: (groupId: string, newGroupProjects: any[]) => s.setProjects([...s.projects.filter(p => p.groupId !== groupId), ...newGroupProjects]),
    reorderGroupOverviews: (groupId: string, newGroupOverviews: any[]) => s.setTerminalOverviews([...s.terminalOverviews.filter(o => o.groupId !== groupId), ...newGroupOverviews]),
    handleOpenEditOverview, submitRename, handleCloseSelected, handleCreateGroup, setRenamingId, setPendingItemId
  };
}
