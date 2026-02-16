/**
 * @file BashTerminal.tsx
 * @description Integrated terminal component using xterm.js with PTY support
 * Provides a fully functional bash shell with real-time output streaming
 * 
 * Features:
 * - WebGL rendering for performance
 * - PTY (Pseudo Terminal) integration via Rust backend
 * - Automatic resize handling
 * - Visibility-aware suspension to save resources
 * - Activity status detection and reporting
 * 
 * @component BashTerminal
 * @example
 * <BashTerminal projectId="/path/to/project" />
 */

import { useEffect, useRef, memo, useMemo } from "react";
import { Terminal as XTerm } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { WebglAddon } from "@xterm/addon-webgl";
import "xterm/css/xterm.css";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { useStore } from "../../../store/useStore";

/**
 * BashTerminal Component
 * 
 * Manages a PTY-connected terminal instance for a specific project.
 * Each project gets its own isolated bash shell with persistent state.
 * 
 * @param {Object} props - Component props
 * @param {string} props.projectId - Unique identifier for the project (used as working directory)
 * @returns {JSX.Element} The terminal interface
 */
export const BashTerminal = memo(({ projectId }: { projectId: string }) => {
  // Reference to the DOM container for xterm
  const ref = useRef<HTMLDivElement>(null);
  
  // Generate stable PTY ID by sanitizing project path (removes special characters)
  // This ensures each project has a consistent, safe identifier for the PTY session
  const ptyId = useMemo(() => `bash-${projectId.replace(/[^a-zA-Z0-9]/g, '-')}`, [projectId]);
  
  // Track if this terminal has already spawned to prevent duplicate PTY processes
  const spawnedRef = useRef<string | null>(null);
  
  // Timeout reference for debouncing activity status updates
  const activityTimeout = useRef<any>(null);
  
  // Global store action to update project status based on terminal activity
  const setStatus = useStore(s => s.setProjectStatus);

  /**
   * Main effect: Initialize and manage the terminal lifecycle
   * Handles PTY spawning, event listeners, resize handling, and cleanup
   */
  useEffect(() => {
    // Safety lock: Don't proceed if container ref is not ready
    if (!ref.current) return;
    
    // Mount state tracking to prevent updates after unmount
    let isMounted = true;
    
    // Flag to track if PTY has been successfully spawned
    const ptySpawned = { current: false };
    
    // Observers and timeouts for cleanup
    let resizeObserver: ResizeObserver | null = null;
    let resizeTimeout: any;
    let intersectionObserver: IntersectionObserver | null = null;

    /**
     * Initialize xterm.js terminal with optimized settings
     * Uses JetBrains Mono font for better developer experience
     */
    const term = new XTerm({
      cursorBlink: true, 
      fontSize: 14,
      fontFamily: 'JetBrains Mono, Menlo, Monaco, Consolas, monospace',
      theme: { 
        background: '#ffffff', 
        foreground: '#1e293b', 
        cursor: '#4f46e5',
        selectionBackground: 'rgba(79, 70, 229, 0.2)'
      },
      convertEol: true,      // Convert line endings for cross-platform compatibility
      scrollback: 1000,      // Keep last 1000 lines in buffer
      letterSpacing: 0,
      lineHeight: 1
    });
    
    // Fit addon automatically adjusts terminal size to container
    const fit = new FitAddon();
    term.loadAddon(fit);

    // Enable WebGL for raw performance
    try {
      const webgl = new WebglAddon();
      term.loadAddon(webgl);
      console.log(`[Terminal] WebGL enabled for ${ptyId}`);
    } catch (e) {
      console.warn("[Terminal] WebGL failed, falling back to Canvas/DOM", e);
    }

    // Mount terminal to DOM
    term.open(ref.current);

    /**
     * Handle terminal resize events
     * Direct xterm -> PTY sync with double signal to force redraw
     * The double signal ensures the prompt is properly repositioned
     */
    term.onResize(({ cols, rows }) => {
      if (ptySpawned.current) {
        invoke("resize_pty", { id: ptyId, rows, cols }).catch(() => {});
        // Second signal to stabilize the prompt after resize
        setTimeout(() => {
          invoke("resize_pty", { id: ptyId, rows, cols }).catch(() => {});
        }, 50);
      }
    });

    /**
     * Synchronize terminal size with container dimensions
     * Called on initial mount and whenever container size changes
     */
    const handleResize = () => {
      if (!isMounted || !ref.current) return;
      const syncSize = () => {
        if (!isMounted || !ref.current) return;
        fit.fit();
        if (ptySpawned.current && term.rows > 0 && term.cols > 0) {
          invoke("resize_pty", { id: ptyId, rows: term.rows, cols: term.cols }).catch(() => {});
        }
        term.refresh(0, term.rows - 1);
        term.scrollToBottom();
      };
      syncSize();
      setTimeout(syncSize, 100);
      setTimeout(syncSize, 250);
    };

    // Watch for container size changes
    resizeObserver = new ResizeObserver(() => {
      if (ref.current?.offsetWidth && ref.current?.offsetHeight) {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 60);
      }
    });
    resizeObserver.observe(ref.current);
    
    /**
     * Listen for data from PTY process
     * Writes received data to the terminal display
     */
    const unlistenData = listen(`pty-data-${ptyId}`, (e: any) => {
      if (isMounted) term.write(e.payload);
    });

    /**
     * Listen for status updates from PTY
     * Updates project status based on terminal activity (idle/working/intervene)
     */
    const unlistenStatus = listen(`pty-status-${ptyId}`, (e: any) => {
      if (!isMounted) return;
      const status = e.payload;
      if (status === 'working' || status === 'busy') {
        setStatus(projectId, 'working');
        if (activityTimeout.current) clearTimeout(activityTimeout.current);
        if (status === 'busy') {
          activityTimeout.current = setTimeout(() => setStatus(projectId, 'idle'), 2000);
        }
      } else if (status === 'intervene') {
        setStatus(projectId, 'intervene');
      } else if (status === 'idle') {
        setStatus(projectId, 'idle');
      }
    });

    // Handle user input - send to PTY
    term.onData(data => {
      invoke("write_to_pty", { id: ptyId, data });
      setStatus(projectId, 'working');
    });

    /**
     * Spawn a new PTY session for this terminal
     * Waits for fonts to load before calculating terminal dimensions
     */
    const startTerminal = () => {
      if (!isMounted || spawnedRef.current === ptyId) return;
      spawnedRef.current = ptyId;

      document.fonts.ready.then(async () => {
        if (!isMounted || !ref.current) return;
        await new Promise(r => setTimeout(r, 600));
        fit.fit();
        const rows = term.rows > 0 ? term.rows : 24;
        const cols = term.cols > 0 ? term.cols : 80;
        
        try {
          // Spawn PTY with project path as working directory
          const isNew = await invoke<boolean>("spawn_pty", { id: ptyId, cwd: projectId, rows, cols });
          if (!isMounted) return;
          ptySpawned.current = true;
          if (isNew) {
            // Customize prompt for new terminals
            setTimeout(() => {
              invoke("write_to_pty", { id: ptyId, data: "export PS1='> '; clear\n" }).catch(() => {});
            }, 100);
          }
          setTimeout(() => {
            if (isMounted) { handleResize(); term.focus(); }
          }, 350);
        } catch (err) { console.error("[Bash] Spawn error:", err); }
      });
    };

    /**
     * Use IntersectionObserver to detect terminal visibility
     * Only start PTY when terminal becomes visible
     * Notify Rust backend to suspend stream when invisible
     */
    if (ref.current) {
      intersectionObserver = new IntersectionObserver((entries) => {
        const visible = entries[0].isIntersecting;
        if (visible) startTerminal();
        // NOTIFY RUST: Suspend stream if invisible
        invoke("set_pty_visibility", { id: ptyId, visible }).catch(() => {});
      }, { threshold: 0.1 });
      intersectionObserver.observe(ref.current);
    }

    // Cleanup function: Remove all listeners and dispose terminal
    return () => { 
      isMounted = false;
      spawnedRef.current = null;
      invoke("set_pty_visibility", { id: ptyId, visible: false }).catch(() => {});
      unlistenData.then(f => f()); 
      unlistenStatus.then(f => f()); 
      term.dispose(); 
      if (resizeObserver) resizeObserver.disconnect();
      if (intersectionObserver) intersectionObserver.disconnect();
      clearTimeout(resizeTimeout);
      if (activityTimeout.current) clearTimeout(activityTimeout.current);
    };
  }, [projectId, ptyId, setStatus]);

  return (
    <div className="absolute inset-0 bg-white">
      <div ref={ref} className="w-full h-full" />
    </div>
  );
});

// Display name for debugging
BashTerminal.displayName = 'BashTerminal';
