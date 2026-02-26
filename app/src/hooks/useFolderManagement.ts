import { useCallback } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { useStore } from "../store/useStore";
import { useShallow } from "zustand/react/shallow";
import { useOxideCommand } from "./useOxideCommand";

export function useFolderManagement() {
  const { addProjects, replaceProject, applyFilePatch } = useStore(useShallow(s => ({
    addProjects: s.addProjects,
    replaceProject: s.replaceProject,
    applyFilePatch: s.applyFilePatch
  })));
  const execute = useOxideCommand();

  const scanAndRegister = useCallback(async (path: string) => {
    const res = await execute<any>("scan_project", { path, recursive: true });
    if (res) execute("index_project_lsm", { path }).catch(() => {});
    return res ? { path, name: path.split('/').pop() || path, tree: res.tree } : null;
  }, [execute]);

  const scanFolder = useCallback(async (id: string, path: string) => {
    const res = await execute<any>("scan_project", { path, recursive: false });
    if (res) applyFilePatch(id, { parent_path: path, added: res.tree, removed: [] });
  }, [execute, applyFilePatch]);

  const openFolder = useCallback(async (mode: 'add' | 'replace') => {
    const selected = await open({ directory: true, multiple: true });
    const selectedPaths = Array.isArray(selected) ? selected : (selected ? [selected] : []);
    if (selectedPaths.length === 0) return;

    if (mode === 'replace') {
      const data = await scanAndRegister(selectedPaths[0]);
      if (data) {
        replaceProject(data.path, data.name, data.tree);
        useStore.getState().switchProject(data.path);
      }
    } else {
      const results = await Promise.all(selectedPaths.map(p => scanAndRegister(p)));
      const valid = results.filter((r): r is any => r !== null);
      if (valid.length > 0) {
        addProjects(valid);
        useStore.getState().switchProject(valid[0].path);
      }
    }
  }, [scanAndRegister, addProjects, replaceProject]);

  return { openFolder, scanFolder };
}
