
import { useEffect, useRef } from "react";
import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/core";
import { useStore } from "../../../store/useStore";
import { checkGeminiStatus } from "./terminalGemini";
import { Terminal as XTerm } from "xterm";

export function useTerminalEvents(projectId: string, ptyId: string, isOverview: boolean, term: XTerm | null) {
  const timeout = useRef<any>(null);
  const { setProjectStatus, updateProject } = useStore.getState();

  useEffect(() => {
    if (!term) return;
    const unData = listen(`pty-data-${ptyId}`, (e: any) => {
      const data = e.payload || ""; term.write(data);
      const res = checkGeminiStatus(data);
      if (res !== null) updateProject(projectId, { isGeminiActive: res });
      if (data.toLowerCase().includes('keep trying')) invoke("write_to_pty", { id: ptyId, data: "1\n" }).catch(() => {});
    });
    const unStat = listen(`pty-status-${ptyId}`, (e: any) => {
      if (isOverview) return;
      if (e.payload === 'working' || e.payload === 'busy') {
        setProjectStatus(projectId, 'working');
        if (timeout.current) clearTimeout(timeout.current);
        if (e.payload === 'busy') timeout.current = setTimeout(() => setProjectStatus(projectId, 'idle'), 2000);
      } else setProjectStatus(projectId, e.payload === 'intervene' ? 'intervene' : 'idle');
    });
    return () => { unData.then(f => f()); unStat.then(f => f()); clearTimeout(timeout.current); };
  }, [projectId, ptyId, isOverview, term, setProjectStatus, updateProject]);
}
