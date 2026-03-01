import { ProjectSession, FileEntry } from "../config/types";

export const createProject = (path: string, name: string, tree: FileEntry[]): ProjectSession => {
  const id = path?.trim() || `proj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const taskFile = (tree || []).find(f => !f.isFolder && ['task.md', 'tasks.md'].includes(f.name.toLowerCase()));
  return {
    id, name, terminalTab: 'bash', status: 'idle', selectedFile: null, 
    followedFilePath: taskFile ? taskFile.path : null, taskProgress: null,
    fileContent: '', fileUrl: null, tree: tree || [], isLoading: false
  };
};

export const updateProjectsWithNew = (projects: ProjectSession[], newItems: { path: string, name: string, tree: FileEntry[] }[]) => {
  const added: ProjectSession[] = [];
  for (const item of newItems) {
    if (projects.find(p => p.id === item.path)) continue;
    added.push(createProject(item.path, item.name, item.tree));
  }
  return added;
};
