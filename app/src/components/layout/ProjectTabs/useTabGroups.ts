
import { useState } from "react";
import { t } from "../../../i18n";

export function useTabGroups(createGroup: any, ovs: any[], closeP: any, closeO: any) {
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState(t('tabs.new_group'));
  const [pendingItemId, setPendingItemId] = useState<string | null>(null);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [selectedCloseIds, setSelectedCloseIds] = useState<string[]>([]);

  const handleCreateGroup = () => {
    if (newGroupName.trim() && pendingItemId) {
      createGroup(newGroupName.trim(), [pendingItemId]);
      setShowGroupModal(false); setPendingItemId(null); setNewGroupName(t('tabs.new_group'));
    }
  };

  const handleCloseSelected = () => {
    selectedCloseIds.forEach(id => { if (ovs.some(o => o.id === id)) closeO(id); else closeP(id); });
    setShowCloseModal(false); setSelectedCloseIds([]);
  };

  return { showGroupModal, setShowGroupModal, newGroupName, setNewGroupName, pendingItemId, setPendingItemId, showCloseModal, setShowCloseModal, selectedCloseIds, setSelectedCloseIds, handleCreateGroup, handleCloseSelected };
}
