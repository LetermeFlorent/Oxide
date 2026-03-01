
import { ProjectSession, ProjectStatus, FileEntry } from "../config/types";

export const createProject = (path: string, name: string, tree: FileEntry[]): ProjectSession => {
  const taskFile = (tree || []).find(f => !f.isFolder && ['task.md', 'tasks.md'].includes(f.name.toLowerCase()));
  return {
    id: path, name, terminalTab: 'bash', status: 'idle', selectedFile: null, 
    followedFilePath: taskFile ? taskFile.path : null, taskProgress: null,
    fileContent: '', fileUrl: null, tree: tree || [], isLoading: !tree || tree.length === 0
  };
};

export const addProjectAction = (path: string, name: string, tree: any) => (s: any) => {
  const id = path || `p-${Date.now()}`;
  if (s.projects.some((p: any) => p.id === id)) return {};
  return { projects: [...s.projects, createProject(id, name, tree)], activeProjectId: id, showSettings: false };
};

export const closeProjectAction = (id: string) => (s: any) => {
  const next = s.projects.filter((p: any) => p.id !== id);
  const active = s.activeProjectId === id ? (next[0]?.id || null) : s.activeProjectId;
  return { projects: next, activeProjectId: active };
};

export const updateProjectField = (id: string, field: string, value: any) => (s: any) => ({
  projects: s.projects.map((p: any) => p.id === id ? { ...p, [field]: value } : p)
});
