/**
 * @file ProjectWatcher.tsx
 * @description Background component to watch project file systems
 */

import { useEffect, memo, useMemo, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { useStore } from "../../store/useStore";
import { mergeTrees } from "../../utils/treeUtils";

const Watcher = memo(({ id }: { id: string }) => {
  const updateProjectTree = useStore(s => s.updateProjectTree);
  const applyFilePatch = useStore(s => s.applyFilePatch);
  // SELECTION CIBLÉE : Ne ré-exécute pas si un AUTRE projet change
  const projectEmpty = useStore(s => {
    const p = s.projects.find(px => px.id === id);
    return !p || !p.tree || p.tree.length === 0 || p.isLoading;
  });
  const refreshTimer = useRef<any>(null);

  useEffect(() => {
    const refresh = async (path?: string) => {
      try {
        const targetPath = path || id;
        
        if (!path || path === id) {
          // 1. START FAST STREAMED SCAN FOR ROOT
          await invoke("scan_project_streamed", { path: id, recursive: false });
          
          // Ensure isLoading is cleared even if folder is empty
          const p = useStore.getState().projects.find(px => px.id === id);
          if (p?.isLoading) {
            // We give some time for chunks to arrive, then force clear loading if tree is still empty
            setTimeout(() => {
              const pNow = useStore.getState().projects.find(px => px.id === id);
              if (pNow?.isLoading) updateProjectTree(id, pNow.tree || [], pNow.imageFiles);
            }, 1000);
          }

          // 2. TRIGGER FULL DB INDEXING IN BACKGROUND
          invoke("index_project_db", { path: id }).catch(() => {});
          return;
        }

        // NATIVE DIFFING: Sync disk with DB and get patches
        const patch = await invoke<any>("sync_dir", { projectId: id, path: targetPath });
        if (patch.added.length > 0 || patch.removed.length > 0) {
          applyFilePatch(id, patch);
        } else {
          // FALLBACK: If no patch but we need to ensure children are loaded (e.g. initial expansion)
          let children = await invoke<any[]>("list_folder_from_db", { path: targetPath });
          if (children.length === 0) {
             const res = await invoke<any>("scan_project", { path: targetPath, recursive: false });
             children = res.tree;
          }

          const state = useStore.getState();
          const p = state.projects.find(px => px.id === id);
          if (!p) return;

          const updateRecursive = (nodes: any[]): any[] => {
            return nodes.map(node => {
              if (node.path === targetPath) {
                return { ...node, children: mergeTrees(node.children || [], children) };
              }
              if (node.children) return { ...node, children: updateRecursive(node.children) };
              return node;
            });
          };
          updateProjectTree(id, updateRecursive(p.tree), p.imageFiles);
        }
      } catch (e) {
        console.error("[Watcher] Sync error:", e);
      }
    };

    if (projectEmpty) {
      refresh();
    }

    // LISTEN FOR CHUNKS
    const unlistenChunks = listen<any[]>(`fs-chunk-${id}`, (event) => {
      const state = useStore.getState();
      const p = state.projects.find(px => px.id === id);
      if (p) {
        const merged = mergeTrees(p.tree, event.payload);
        updateProjectTree(id, merged, p.imageFiles);
      }
    });

    invoke("watch_project", { id, path: id }).catch(() => {});
    const unlistenFs = listen<string[]>(`fs-change-${id}`, (event) => {
      const paths = event.payload || [];
      if (paths.length === 0) { refresh(); return; }
      
      // DEBOUNCE + THROTTLE : Handle high-frequency events correctly
      clearTimeout(refreshTimer.current);
      
      const now = Date.now();
      const last = (window as any)[`last_refresh_${id}`] || 0;
      const elapsed = now - last;
      
      // If we haven't refreshed in 2 seconds, force it now
      if (elapsed > 2000) {
        (window as any)[`last_refresh_${id}`] = now;
        const dirs = new Set<string>();
        paths.forEach(p => {
          const parent = p.split(/[\\/]/).slice(0, -1).join('/') || id;
          dirs.add(parent);
        });
        dirs.forEach(d => refresh(d));
      } else {
        // Otherwise wait a bit (Adaptive)
        let delay = 300;
        if (paths.length > 500) delay = 1000;
        if (paths.length > 2000) delay = 3000;
        
        refreshTimer.current = setTimeout(() => {
          (window as any)[`last_refresh_${id}`] = Date.now();
          const dirs = new Set<string>();
          paths.forEach(p => {
            const parent = p.split(/[\\/]/).slice(0, -1).join('/') || id;
            dirs.add(parent);
          });
          dirs.forEach(d => refresh(d));
        }, delay);
      }
    });
    
    return () => {
      clearTimeout(refreshTimer.current);
      unlistenFs.then(f => f());
      unlistenChunks.then(f => f());
      invoke("unwatch_project", { id }).catch(() => {});
    };
  }, [id, updateProjectTree, projectEmpty]);

  return null;
});

export const ProjectWatcher = memo(() => {
  const activeProjectId = useStore(s => s.activeProjectId);
  const terminalOverviews = useStore(s => s.terminalOverviews);
  const activeOverview = terminalOverviews.find(o => o.id === activeProjectId);
  
  const idsToWatch = useMemo(() => {
    if (!activeProjectId) return [];
    const baseIds = activeOverview ? activeOverview.projectIds : [activeProjectId];
    return baseIds.filter(id => id && id.trim() !== "");
  }, [activeProjectId, activeOverview]);

  return <>{idsToWatch.map(id => <Watcher key={id} id={id} />)}</>;
});
