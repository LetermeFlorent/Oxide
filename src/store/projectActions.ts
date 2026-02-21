import { ProjectSession, FileEntry } from "./types";

export const createProject = (path: string, name: string, tree: FileEntry[]): ProjectSession => {
  const taskFile = (tree || []).find(f => !f.isFolder && ['task.md', 'tasks.md'].includes(f.name.toLowerCase()));
  return {
    id: path, name, terminalTab: 'bash', status: 'idle', selectedFile: null, 
    followedFilePath: taskFile ? taskFile.path : null, taskProgress: null,
    fileContent: '', fileUrl: null, tree: tree || [], isLoading: !tree || tree.length === 0
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
