import { ProjectStatus } from "./types";
import { createProject } from "./projectActions";

export const addProject = (path: string, name: string, tree: any) => (s: any) => {
  // Absolute prevention of empty or duplicate ID
  const id = path?.trim() || `proj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  if (s.projects.some((p: any) => p.id === id)) return {};
  const p = createProject(id, name, tree);
  return { 
    projects: [...s.projects, p], 
    activeProjectId: id, 
    showSettings: false,
    globalTabsOrder: Array.from(new Set([...(s.globalTabsOrder || []), id]))
  };
};

export const addProjects = (items: any[]) => (s: any) => {
  const next = [...s.projects];
  const newOrder = [...(s.globalTabsOrder || [])];
  
  items.forEach(it => {
    const id = it.path?.trim() || `proj-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    if (!next.some(p => p.id === id)) {
      next.push(createProject(id, it.name, it.tree));
      newOrder.push(id);
    }
  });
  
  return { projects: next, globalTabsOrder: Array.from(new Set(newOrder)) };
};

export const closeProject = (id: string) => (s: any) => {
  const next = s.projects.filter((p: any) => p.id !== id);
  const nextOrder = (s.globalTabsOrder || []).filter((oid: string) => oid !== id);
  return { 
    projects: next, 
    globalTabsOrder: nextOrder,
    activeProjectId: s.activeProjectId === id ? (next[0]?.id || s.terminalOverviews[0]?.id || null) : s.activeProjectId 
  };
};

export const setProjectStatus = (id: string, status: ProjectStatus) => (s: any) => ({
  projects: s.projects.map((p: any) => p.id === id ? { ...p, status } : p)
});

export const setFollowedFile = (pid: string, path: string | null, pr: number | null) => (s: any) => ({
  projects: s.projects.map((p: any) => p.id === pid ? { ...p, followedFilePath: path, taskProgress: pr } : p)
});
