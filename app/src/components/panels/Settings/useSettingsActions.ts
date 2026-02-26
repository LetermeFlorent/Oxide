
import { useState, useCallback } from "react";
import { useStore } from "../../../store/useStore";

export function useSettingsActions(globalState: any) {
  const [localState, setLocalState] = useState(globalState);
  const { setSetting, toggleSettings } = useStore.getState();

  const updateSetting = useCallback((key: string, value: boolean) => {
    setLocalState((prev: any) => {
      const next = { ...prev, [key]: value };
      if (key === 'reopenLastFiles' && !value) { 
        next.restoreFollowedFiles = false; next.restoreActiveTab = false; 
      }
      if (key === 'restoreActiveTab' && value && !next.reopenLastFiles) {
        next.reopenLastFiles = true;
      }
      return next;
    });
  }, []);

  const handleSave = useCallback(() => {
    Object.entries(localState).forEach(([k, v]) => {
      if ((globalState as any)[k] !== v) setSetting(k as any, v as boolean);
    });
    toggleSettings(false);
  }, [localState, globalState, setSetting, toggleSettings]);

  return { localState, updateSetting, handleSave };
}
