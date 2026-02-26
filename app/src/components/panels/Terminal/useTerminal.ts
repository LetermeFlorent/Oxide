
import { useEffect, useRef, useMemo, useState } from "react";
import { Terminal as XTerm } from "xterm";
import "xterm/css/xterm.css";
import { FitAddon } from "xterm-addon-fit";
import { invoke } from "@tauri-apps/api/core";
import { useStore } from "../../../store/useStore";
import { TERMINAL_CONFIG, useTerminalState, useTerminalEvents, useTerminalLifecycle, useTerminalResizing } from "./index";

export function useTerminal(projectId: string, ptyId: string, isOverview: boolean = false) {
  const ref = useRef<HTMLDivElement>(null);
  const [term, setTerm] = useState<XTerm | null>(null);
  const [fit, setFit] = useState<FitAddon | null>(null);
  const { isActive } = useTerminalState(projectId, ptyId, isOverview, term);

  useEffect(() => {
    if (!ref.current) return;
    const instance = new XTerm(TERMINAL_CONFIG);
    const fitAddon = new FitAddon();
    instance.loadAddon(fitAddon);
    instance.open(ref.current);
    
    instance.onData(data => { 
      invoke("write_to_pty", { id: ptyId, data }); 
      if (!isOverview) useStore.getState().setProjectStatus(projectId, 'working'); 
    });

    setTerm(instance);
    setFit(fitAddon);
    return () => { instance.dispose(); setTerm(null); setFit(null); };
  }, [projectId, ptyId, isOverview]);

  useTerminalEvents(projectId, ptyId, isOverview, term);
  useTerminalResizing(ptyId, ref, term, fit);
  useTerminalLifecycle(projectId, ptyId, term, fit, isActive);

  return { ref, term };
}
