
import { useState, useCallback } from "react";

export function useTabRenaming(ovs: any[], upP: any, upO: any) {
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [tempName, setTempName] = useState("");

  const submitRename = useCallback(() => {
    if (renamingId && tempName.trim()) {
      if (ovs.some(o => o.id === renamingId)) upO(renamingId, tempName.trim());
      else upP(renamingId, { name: tempName.trim() });
    }
    setRenamingId(null);
  }, [renamingId, tempName, ovs, upO, upP]);

  return { renamingId, setRenamingId, tempName, setTempName, submitRename };
}
