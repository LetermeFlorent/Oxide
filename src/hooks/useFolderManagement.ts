import { useCallback } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { useStore } from "../store/useStore";
import { monitoredInvoke } from "../utils/performance";

import { useShallow } from "zustand/react/shallow";

export function useFolderManagement() {
  const { addProject, addProjects, replaceProject, activeProjectId } = useStore(useShallow(s => ({
    addProject: s.addProject,
    addProjects: s.addProjects,
    replaceProject: s.replaceProject,
    activeProjectId: s.activeProjectId
  })));

  const scanFolder = useCallback(async (id: string, path: string) => {
    if (!id || !path) return;
    try {
      const res = await monitoredInvoke<any>("scan_project", { path, recursive: false });
      // CRITICAL: Use applyFilePatch to merge children into the correct node
      useStore.getState().applyFilePatch(id, { parent_path: path, added: res.tree, removed: [] });
    } catch (e) { console.error("[Folder] Scan error:", e); }
  }, []);

  const openFolder = useCallback(async (mode: 'add' | 'replace') => {
    const selected = await open({ directory: true, multiple: true });
    if (!selected) return;

    const selectedPaths = Array.isArray(selected) ? selected : [selected];
    if (selectedPaths.length === 0) return;

    if (mode === 'replace' && selectedPaths.length > 0) {
      const path = selectedPaths[0];
      const name = path.split('/').pop() || path;
      try {
        const res = await monitoredInvoke<any>("scan_project", { path, recursive: true });
        replaceProject(path, name, res.tree);
        monitoredInvoke("index_project_lsm", { path }).catch(() => {});
      } catch (e) { console.error("[Folder] Replace error:", e); }
      return;
    }

    const newProjects = [];
    for (const path of selectedPaths) {
      const name = path.split('/').pop() || path;
      const id = (path && path.trim() !== "") ? path : `project-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      
      try {
        const res = await monitoredInvoke<any>("scan_project", { path: id, recursive: true });
        newProjects.push({ path: id, name, tree: res.tree });
        monitoredInvoke("index_project_lsm", { path: id }).catch(() => {});
      } catch (e) { console.error(`[Folder] Open error for ${path}:`, e); }
    }

    if (newProjects.length > 0) {
      addProjects(newProjects);
    }
  }, [addProjects, replaceProject]);

  return { openFolder, scanFolder };
}
