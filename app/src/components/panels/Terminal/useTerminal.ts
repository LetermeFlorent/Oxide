
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
  const isDark = useStore(s => s.isDark);
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

  useEffect(() => {
    if (!term) return;
    term.options.theme = isDark ? {
      background: '#0f172a', foreground: '#f1f5f9', cursor: '#6366f1',
      cursorAccent: '#0f172a', selectionBackground: 'rgba(99, 102, 241, 0.4)',
      black: '#000000', red: '#ef4444', green: '#10b981', yellow: '#f59e0b',
      blue: '#3b82f6', magenta: '#8b5cf6', cyan: '#06b6d4', white: '#cbd5e1'
    } : TERMINAL_CONFIG.theme;
  }, [term, isDark]);

  useTerminalEvents(projectId, ptyId, isOverview, term);
  useTerminalResizing(ptyId, ref, term, fit);
  useTerminalLifecycle(projectId, ptyId, term, fit, isActive);

  return { ref, term };
}
