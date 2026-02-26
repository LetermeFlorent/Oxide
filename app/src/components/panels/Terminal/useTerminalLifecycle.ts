
import { useRef, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Terminal as XTerm } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { checkGeminiStatus } from "./terminalGemini";
import { useStore } from "../../../store/useStore";

export function useTerminalLifecycle(projectId: string, ptyId: string, term: XTerm | null, fit: FitAddon | null, isActive: boolean) {
  const initialized = useRef(new WeakSet<XTerm>());

  useEffect(() => {
    if (!term || !fit || initialized.current.has(term)) return;
    initialized.current.add(term);

    const start = async () => {
      try { await document.fonts.ready; } catch (e) {}
      
      setTimeout(async () => {
        if (!term.element) return;
        fit.fit();
        try {
          const isNew = await invoke<boolean>("spawn_pty", { id: ptyId, cwd: projectId, rows: term.rows || 24, cols: term.cols || 80 });
          if (isNew) {
            // No need for export PS1 or clear as it's handled by PTY env
            await new Promise(r => setTimeout(r, 50));
          }
          const buf = await invoke<string>("get_pty_buffer", { id: ptyId });
          if (buf) { 
            term.write(buf); 
            const res = checkGeminiStatus(buf); 
            if (res !== null) useStore.getState().updateProject(projectId, { isGeminiActive: res }); 
          }
          if (isActive) { term.focus(); await invoke("set_pty_visibility", { id: ptyId, visible: true }); }
        } catch (err) {  }
      }, 100); // Reduced timeout for faster appearance
    };
    start();
  }, [projectId, ptyId, term, fit, isActive]);
}
