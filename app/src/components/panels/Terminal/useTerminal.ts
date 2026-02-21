import { useEffect, useRef } from "react";
import { Terminal as XTerm } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { WebglAddon } from "@xterm/addon-webgl";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { useStore } from "../../../store/useStore";

export function useTerminal(projectId: string, ptyId: string) {
  const ref = useRef<HTMLDivElement>(null);
  const spawnedRef = useRef<string | null>(null);
  const activityTimeout = useRef<any>(null);
  const setStatus = useStore(s => s.setProjectStatus);

  useEffect(() => {
    if (!ref.current) return;
    let isMounted = true;
    const ptySpawned = { current: false };
    let resizeObserver: ResizeObserver | null = null;
    let resizeTimeout: any;
    let intersectionObserver: IntersectionObserver | null = null;

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
        clearTimeout(resizeTimeout); resizeTimeout = setTimeout(handleResize, 150); // Increased debounce
      }
    });
    resizeObserver.observe(ref.current);

    const unlistenData = listen(`pty-data-${ptyId}`, (e: any) => { if (isMounted) term.write(e.payload); });
    const unlistenStatus = listen(`pty-status-${ptyId}`, (e: any) => {
      if (!isMounted) return;
      if (e.payload === 'working' || e.payload === 'busy') {
        setStatus(projectId, 'working');
        if (activityTimeout.current) clearTimeout(activityTimeout.current);
        if (e.payload === 'busy') activityTimeout.current = setTimeout(() => setStatus(projectId, 'idle'), 2000);
      } else setStatus(projectId, e.payload === 'intervene' ? 'intervene' : 'idle');
    });

    term.onData(data => { invoke("write_to_pty", { id: ptyId, data }); setStatus(projectId, 'working'); });

    const start = async () => {
      if (!isMounted || spawnedRef.current === ptyId) return;
      spawnedRef.current = ptyId;
      
      await document.fonts.ready;
      if (!isMounted || !ref.current) return;
      fit.fit();
      
      try {
        // Ensure visibility is false during initial fetch
        await invoke("set_pty_visibility", { id: ptyId, visible: false });
        
        await invoke<boolean>("spawn_pty", { id: ptyId, cwd: projectId, rows: term.rows || 24, cols: term.cols || 80 });
        if (!isMounted) return; ptySpawned.current = true;
        
        // Fetch buffer to restore state
        const buffer = await invoke<string>("get_pty_buffer", { id: ptyId });
        if (isMounted && buffer) {
          term.write(buffer);
        }
        
        if (isMounted) {
          handleResize();
          term.focus();
          // Now enable live data
          await invoke("set_pty_visibility", { id: ptyId, visible: true });
        }
      } catch (err) {
        console.error("Failed to start terminal:", err);
      }
    };

    intersectionObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        start();
        invoke("set_pty_visibility", { id: ptyId, visible: true }).catch(() => {});
      } else {
        // Stop receiving data when not visible to save bandwidth/CPU
        invoke("set_pty_visibility", { id: ptyId, visible: false }).catch(() => {});
      }
    }, { threshold: 0.1 });
    intersectionObserver.observe(ref.current);

    return () => { 
      isMounted = false; spawnedRef.current = null; term.dispose();
      unlistenData.then(f => f()); unlistenStatus.then(f => f()); 
      if (resizeObserver) resizeObserver.disconnect();
      if (intersectionObserver) intersectionObserver.disconnect();
      if (ref.current) ref.current.removeEventListener('keydown', handleKeyDown);
      clearTimeout(resizeTimeout); if (activityTimeout.current) clearTimeout(activityTimeout.current);
    };
  }, [projectId, ptyId, setStatus]);

  return { ref };
}
