import { FileEntry, WorkspaceState } from "./types";
import { applyFilePatch as applyPatch } from "../utils/treeUtils";

/**
 * Updates the tree and image list for a specific project.
 */
export const updateProjectTree = (id: string, tree: FileEntry[], imageFiles?: FileEntry[]) => (s: WorkspaceState) => ({
  projects: s.projects.map(p => p.id === id ? { ...p, tree: tree || [], imageFiles: imageFiles || [], isLoading: false } : p)
});

/**
 * Applies a FilePatch (added/removed) to a project's tree.
 */
export const applyFilePatch = (projectId: string, patch: any) => (s: WorkspaceState) => ({
  projects: s.projects.map(p => p.id === projectId ? { ...p, tree: applyPatch(p.tree, patch) } : p)
});

/**
 * Toggles the expanded state of a folder and manages native watchers.
 */
export const toggleFolder = (path: string, activeProjectId: string | null, monitoredInvoke: any) => (s: WorkspaceState) => {
  const nextState = !s.expandedFolders[path];
  if (activeProjectId) {
    if (nextState) {
      monitoredInvoke("watch_folder", { id: activeProjectId, path }).catch(console.error);
    } else {
      monitoredInvoke("unwatch_folder", { id: activeProjectId, path }).catch(console.error);
    }
  }
  return { expandedFolders: { ...s.expandedFolders, [path]: nextState } };
};
