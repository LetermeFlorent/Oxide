
import { useState, useMemo } from "react";
import { useStore } from "../../../store/useStore";
import { t } from "../../../i18n";
import { useTabRenaming } from "./useTabRenaming";
import { useTabGroups } from "./useTabGroups";

export function useProjectTabs() {
  const s = useStore();
  
  const renamingId = useStore(st => st.renamingId);
  const setRenamingId = useStore(st => st.setRenamingId);
  const tempName = useStore(st => st.tempName);
  const setTempName = useStore(st => st.setTempName);
  const showGroupModal = useStore(st => st.showGroupModal);
  const setShowGroupModal = useStore(st => st.setShowGroupModal);
  const pendingItemId = useStore(st => st.pendingItemId);
  const setPendingItemId = useStore(st => st.setPendingItemId);

  const submitRename = () => {
    if (!renamingId || !tempName.trim()) {
      setRenamingId(null);
      return;
    }
    const isGroup = s.groups.some(g => g.id === renamingId);
    if (isGroup) {
      s.renameGroup(renamingId, tempName.trim());
    } else if (s.terminalOverviews.some(o => o.id === renamingId)) {
      s.updateTerminalOverview(renamingId, tempName.trim());
    } else {
      s.updateProject(renamingId, { name: tempName.trim() });
    }
    setRenamingId(null);
  };

  const { newGroupName, setNewGroupName, showCloseModal, setShowCloseModal, selectedCloseIds, setSelectedCloseIds, handleCreateGroup, handleCloseSelected } = useTabGroups(s.createGroup, s.terminalOverviews, s.closeProject, s.closeTerminalOverview);
  
  // Custom handleCreateGroup to use global pendingItemId
  const handleGlobalCreateGroup = () => {
    if (newGroupName.trim() && pendingItemId) {
      s.createGroup(newGroupName.trim(), [pendingItemId]);
      setShowGroupModal(false);
      setPendingItemId(null);
    }
  };

  const [showEditOverviewModal, setShowEditOverviewModal] = useState(false);
  const [editingOverviewId, setEditingOverviewId] = useState<string | null>(null);
  const [editingProjectIds, setEditingProjectIds] = useState<string[]>([]);

  const allTabs = useMemo(() => {
    const tabsMap = new Map<string, any>();

    // 1. Add Groups
    s.groups.forEach(g => {
      tabsMap.set(g.id, { id: g.id, name: g.name, type: 'group' as const, data: g });
    });

    // 2. Add Overviews (not grouped)
    s.terminalOverviews.filter(o => !o.groupId).forEach(o => {
      const id = o.id?.trim();
      if (id) tabsMap.set(id, { id, name: o.name, type: 'overview' as const });
    });

    // 3. Add Projects (not grouped)
    s.projects.filter(p => !p.groupId).forEach(p => {
      const id = p.id?.trim();
      if (id) tabsMap.set(id, { id, name: p.name, type: 'project' as const });
    });

    // 4. Add Settings
    if (s.showSettings) {
      tabsMap.set('settings', { id: 'settings', name: 'Settings', type: 'settings' as const });
    }
    
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
    projects: s.projects, terminalOverviews: s.terminalOverviews, groups: s.groups, activeProjectId: s.activeProjectId, allTabs, renamingId, tempName, setTempName, 
    showEditOverviewModal, setShowEditOverviewModal, editingOverviewId, editingProjectIds, setEditingProjectIds, showGroupModal, setShowGroupModal, newGroupName, setNewGroupName, showCloseModal, setShowCloseModal, selectedCloseIds, setSelectedCloseIds,
    switchProject: s.switchProject, closeProject: s.closeProject, closeTerminalOverview: s.closeTerminalOverview, updateProject: s.updateProject, updateTerminalOverview: s.updateTerminalOverview, 
    deleteGroup: s.deleteGroup, toggleGroup: s.toggleGroup, moveToGroup: s.moveToGroup, createGroup: s.createGroup, setProjects: s.setProjects, setTerminalOverviews: s.setTerminalOverviews,
    setGlobalTabsOrder: s.setGlobalTabsOrder, setContextMenu: s.setContextMenu, contextMenu: s.contextMenu,
    reorderUngroupedProjects: (newUngrouped: any[]) => s.setProjects([...s.projects.filter(p => p.groupId), ...newUngrouped]),
    reorderUngroupedOverviews: (newUngrouped: any[]) => s.setTerminalOverviews([...s.terminalOverviews.filter(o => o.groupId), ...newUngrouped]),
    reorderGroupProjects: (groupId: string, newGroupProjects: any[]) => s.setProjects([...s.projects.filter(p => p.groupId !== groupId), ...newGroupProjects]),
    reorderGroupOverviews: (groupId: string, newGroupOverviews: any[]) => s.setTerminalOverviews([...s.terminalOverviews.filter(o => o.groupId !== groupId), ...newGroupOverviews]),
    handleOpenEditOverview, submitRename, handleCloseSelected, handleCreateGroup: handleGlobalCreateGroup, setRenamingId, setPendingItemId
  };
}
