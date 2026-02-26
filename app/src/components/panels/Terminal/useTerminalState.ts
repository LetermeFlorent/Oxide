
import { useEffect } from "react";
import { useStore } from "../../../store/useStore";
import { invoke } from "@tauri-apps/api/core";
import { Terminal as XTerm } from "xterm";

export function useTerminalState(projectId: string, ptyId: string, isOverview: boolean, term: XTerm | null) {
  const isActive = useStore(s => {
    if (s.activeProjectId === projectId && !isOverview) return true;
    return !!s.terminalOverviews.find(o => o.id === s.activeProjectId)?.projectIds.includes(projectId);
  });

  useEffect(() => {
    invoke("set_pty_visibility", { id: ptyId, visible: isActive }).catch(() => {});
    if (isActive && term) term.focus();
  }, [isActive, ptyId, term]);

  return { isActive };
}
