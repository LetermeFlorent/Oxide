
import { useEffect, useRef } from "react";
import { useStore } from "../store/useStore";

export function useAppStateSync(ready: boolean, activeId: string | null, onFile: (f: any) => void) {
  const restoreRef = useRef("");

  useEffect(() => {
    if (ready && activeId && restoreRef.current !== activeId) {
      const p = useStore.getState().projects.find(px => px.id === activeId);
      if (p?.selectedFile) onFile(p.selectedFile);
      restoreRef.current = activeId;
    }
  }, [ready, activeId, onFile]);

  useEffect(() => {
    if (ready && activeId && activeId !== 'settings') {
      const validP = useStore.getState().projects.some(p => p.id === activeId);
      const validO = useStore.getState().terminalOverviews.some(o => o.id === activeId);
      if (!validP && !validO) useStore.setState({ activeProjectId: null });
    }
  }, [ready, activeId]);
}
