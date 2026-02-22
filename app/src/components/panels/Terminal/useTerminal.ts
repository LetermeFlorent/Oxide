import { useEffect, useRef } from "react";
import { Terminal as XTerm } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { WebglAddon } from "@xterm/addon-webgl";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { useStore } from "../../../store/useStore";

export function useTerminal(projectId: string, ptyId: string, isOverview: boolean = false) {
  const ref = useRef<HTMLDivElement>(null);
  const termRef = useRef<XTerm | null>(null);
  const spawnedRef = useRef<string | null>(null);
  const activityTimeout = useRef<any>(null);
  const setStatus = useStore(s => s.setProjectStatus);
  
  const isActive = useStore(s => {
    if (s.activeProjectId === projectId && !isOverview) return true;
    const overview = s.terminalOverviews.find(o => o.id === s.activeProjectId);
    return !!overview?.projectIds.includes(projectId);
  });

  // Sync PTY visibility with reactive isActive state
  useEffect(() => {
    if (isActive) {
      invoke("set_pty_visibility", { id: ptyId, visible: true }).catch(() => {});
      if (termRef.current) termRef.current.focus();
    } else {
      invoke("set_pty_visibility", { id: ptyId, visible: false }).catch(() => {});
    }
  }, [isActive, ptyId]);

  useEffect(() => {
    if (!ref.current) return;
    let isMounted = true;
    const ptySpawned = { current: false };
    let resizeObserver: ResizeObserver | null = null;
    let resizeTimeout: any;

    const term = new XTerm({
      cursorBlink: true, fontSize: 15, convertEol: true, scrollback: 5000,
      fontFamily: 'JetBrains Mono, Menlo, Monaco, Consolas, monospace',
      letterSpacing: 0.5, lineHeight: 1.4,
      theme: { 
        background: '#ffffff', 
        foreground: '#1e293b', 
        cursor: '#6366f1', 
        cursorAccent: '#ffffff',
        selectionBackground: 'rgba(99, 102, 241, 0.2)',
        black: '#000000',
        red: '#ef4444',
        green: '#10b981',
        yellow: '#f59e0b',
        blue: '#3b82f6',
        magenta: '#8b5cf6',
        cyan: '#06b6d4',
        white: '#cbd5e1'
      },
    });
    termRef.current = term;
    const fit = new FitAddon(); term.loadAddon(fit);
    try { term.loadAddon(new WebglAddon()); } catch (e) {}
    term.open(ref.current);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && (e.key === '=' || e.key === '+' || e.key === '-')) {
        e.preventDefault();
        const delta = (e.key === '=' || e.key === '+') ? 1 : -1;
        const newSize = Math.max(8, Math.min(40, (term.options.fontSize || 15) + delta));
        term.options.fontSize = newSize;
        fit.fit();
      }
    };
    ref.current.addEventListener('keydown', handleKeyDown);

    const handleResize = () => {
      if (!isMounted || !ref.current) return;
      fit.fit();
      if (ptySpawned.current && term.rows > 0 && term.cols > 0) {
        invoke("resize_pty", { id: ptyId, rows: term.rows, cols: term.cols }).catch(() => {});
      }
      term.refresh(0, term.rows - 1); term.scrollToBottom();
    };

    resizeObserver = new ResizeObserver(() => {
      if (ref.current?.offsetWidth && ref.current?.offsetHeight) {
        clearTimeout(resizeTimeout); resizeTimeout = setTimeout(handleResize, 150);
      }
    });
    resizeObserver.observe(ref.current);

    const checkGemini = (text: string) => {
      if (!text) return null;
      // OPTIMIZATION: Only check the last 10k chars to avoid memory corruption on huge buffers
      const analysisText = text.length > 10000 ? text.substring(text.length - 10000) : text;
      const lower = analysisText.toLowerCase();
      
      const startIdx = Math.max(
        lower.lastIndexOf('gemini >'),
        lower.lastIndexOf('type your message'),
        lower.lastIndexOf('gemini.md files'),
        lower.lastIndexOf('gemini code assist')
      );
      const endIdx = Math.max(
        lower.lastIndexOf('bye!'),
        lower.lastIndexOf('exiting gemini'),
        lower.lastIndexOf('goodbye'),
        lower.lastIndexOf('powering down'),
        lower.lastIndexOf('interaction summary'),
        lower.lastIndexOf('wall time')
      );

      if (startIdx !== -1 && startIdx > endIdx) return true;
      if (endIdx !== -1 && endIdx >= startIdx) return false;
      return null; // No change
    };

    const unlistenData = listen(`pty-data-${ptyId}`, (e: any) => { 
      if (!isMounted) return;
      const data = e.payload || "";
      term.write(data);
      
      const res = checkGemini(data);
      if (res !== null) {
        const p = useStore.getState().projects.find(px => px.id === projectId);
        if (p && p.isGeminiActive !== res) {
          useStore.getState().updateProject(projectId, { isGeminiActive: res });
        }
      }

      // AUTO-RETRY ON HIGH DEMAND
      if (data.toLowerCase().includes('keep trying')) {
         invoke("write_to_pty", { id: ptyId, data: "1\n" }).catch(() => {});
      }
    });
    const unlistenStatus = listen(`pty-status-${ptyId}`, (e: any) => {
      if (!isMounted || isOverview) return;
      if (e.payload === 'working' || e.payload === 'busy') {
        setStatus(projectId, 'working');
        if (activityTimeout.current) clearTimeout(activityTimeout.current);
        if (e.payload === 'busy') activityTimeout.current = setTimeout(() => setStatus(projectId, 'idle'), 2000);
      } else setStatus(projectId, e.payload === 'intervene' ? 'intervene' : 'idle');
    });

    term.onData(data => { 
      invoke("write_to_pty", { id: ptyId, data }); 
      if (!isOverview) setStatus(projectId, 'working'); 
    });

    const start = async () => {
      if (!isMounted || spawnedRef.current === ptyId) return;
      spawnedRef.current = ptyId;
      
      await document.fonts.ready;
      if (!isMounted || !ref.current) return;
      fit.fit();
      
      try {
        await invoke("set_pty_visibility", { id: ptyId, visible: false });
        const isNew = await invoke<boolean>("spawn_pty", { id: ptyId, cwd: projectId, rows: term.rows || 24, cols: term.cols || 80 });
        if (!isMounted) return; ptySpawned.current = true;
        
        if (isNew) {
          setTimeout(() => {
            invoke("write_to_pty", { id: ptyId, data: "export PS1='> ' \nclear\n" }).catch(() => {});
          }, 300);
        }

        const buffer = await invoke<string>("get_pty_buffer", { id: ptyId });
        if (isMounted && buffer) {
          term.write(buffer);
          const res = checkGemini(buffer);
          if (res !== null) useStore.getState().updateProject(projectId, { isGeminiActive: res });
        }
        
        if (isMounted) {
          handleResize();
          if (isActive) {
            term.focus();
            await invoke("set_pty_visibility", { id: ptyId, visible: true });
          }
        }
      } catch (err) {
        console.error("Failed to start terminal:", err);
      }
    };

    start();

    return () => { 
      isMounted = false; spawnedRef.current = null; term.dispose(); termRef.current = null;
      unlistenData.then(f => f()); unlistenStatus.then(f => f()); 
      if (resizeObserver) resizeObserver.disconnect();
      if (ref.current) ref.current.removeEventListener('keydown', handleKeyDown);
      clearTimeout(resizeTimeout); if (activityTimeout.current) clearTimeout(activityTimeout.current);
    };
  }, [projectId, ptyId, setStatus, isOverview]);

  return { ref };
}
