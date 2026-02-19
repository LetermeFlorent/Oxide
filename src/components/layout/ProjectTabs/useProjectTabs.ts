import { useState, useMemo, useCallback } from "react";
import { useStore } from "../../../store/useStore";

export function useProjectTabs() {
  const projects = useStore(s => s.projects);
  const terminalOverviews = useStore(s => s.terminalOverviews);
  const groups = useStore(s => s.groups);
  const activeProjectId = useStore(s => s.activeProjectId);
  
  const switchProject = useStore(s => s.switchProject);
  const closeProject = useStore(s => s.closeProject);
  const closeTerminalOverview = useStore(s => s.closeTerminalOverview);
  const updateProject = useStore(s => s.updateProject);
  const updateTerminalOverview = useStore(s => s.updateTerminalOverview);
  const deleteGroup = useStore(s => s.deleteGroup);
  const toggleGroup = useStore(s => s.toggleGroup);
  const moveToGroup = useStore(s => s.moveToGroup);
  const createGroup = useStore(s => s.createGroup);

  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [tempName, setTempName] = useState("");
  const [contextMenu, setContextMenu] = useState<any>(null);
  const [showEditOverviewModal, setShowEditOverviewModal] = useState(false);
  const [editingOverviewId, setEditingOverviewId] = useState<string | null>(null);
  const [editingProjectIds, setEditingProjectIds] = useState<string[]>([]);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("New Group");
  const [pendingItemId, setPendingItemId] = useState<string | null>(null);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [selectedCloseIds, setSelectedCloseIds] = useState<string[]>([]);

  const showSettings = useStore(s => s.showSettings);

  const allTabs = useMemo(() => [
    ...terminalOverviews.map(o => ({ id: o.id, name: o.name, type: 'overview' as const })),
    ...projects.map(p => ({ id: p.id, name: p.name, type: 'project' as const })),
    ...(showSettings ? [{ id: 'settings', name: 'Settings', type: 'settings' as const }] : [])
  ], [projects, terminalOverviews, showSettings]);

  const handleOpenEditOverview = (id: string) => {
    const o = terminalOverviews.find(ov => ov.id === id);
    if (o) { setEditingOverviewId(id); setEditingProjectIds(o.projectIds); setShowEditOverviewModal(true); }
  };

  const submitRename = useCallback(() => {
    if (renamingId && tempName.trim()) {
      if (terminalOverviews.some(o => o.id === renamingId)) updateTerminalOverview(renamingId, tempName.trim());
      else updateProject(renamingId, { name: tempName.trim() });
    }
    setRenamingId(null);
  }, [renamingId, tempName, terminalOverviews, updateTerminalOverview, updateProject]);

  const handleCloseSelected = () => {
    selectedCloseIds.forEach(id => {
      if (terminalOverviews.some(o => o.id === id)) closeTerminalOverview(id);
      else closeProject(id);
    });
    setShowCloseModal(false); setSelectedCloseIds([]);
  };

  const handleCreateGroup = () => {
    if (newGroupName.trim() && pendingItemId) {
      createGroup(newGroupName.trim(), [pendingItemId]);
      setShowGroupModal(false); setPendingItemId(null); setNewGroupName("New Group");
    }
  };

  return {
    projects, terminalOverviews, groups, activeProjectId, allTabs, renamingId, tempName, setTempName, contextMenu, setContextMenu,
    showEditOverviewModal, setShowEditOverviewModal, editingProjectIds, setEditingProjectIds, showGroupModal, setShowGroupModal,
    newGroupName, setNewGroupName, showCloseModal, setShowCloseModal, selectedCloseIds, setSelectedCloseIds,
    switchProject, closeProject, closeTerminalOverview, updateProject, updateTerminalOverview, deleteGroup, toggleGroup, moveToGroup, createGroup,
    handleOpenEditOverview, submitRename, handleCloseSelected, handleCreateGroup, setRenamingId, setPendingItemId
  };
}
