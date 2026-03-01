
import { FileEntry, ProjectSession, ProjectStatus, WorkspaceState } from "../config/types";

const isValidPath = (path: string | null | undefined): path is string => {
  return !!(path && typeof path === 'string' && path.trim().length > 0);
};

/**
 * Creates a new project session object with defaults.
 */
export const createProject = (path: string, name: string, tree: FileEntry[]): ProjectSession | null => {
  if (!isValidPath(path)) {
    
    return null;
  }
  
  const taskFile = (tree || []).find(f => !f.isFolder && ['task.md', 'tasks.md'].includes(f.name.toLowerCase()));
  const defaultTerminalId = `terminal-${Math.random().toString(36).substring(2, 11)}`;
  return {
    id: path, name, terminalTab: 'bash', status: 'idle', selectedFile: null, 
    followedFilePath: taskFile ? taskFile.path : null, taskProgress: null,
    fileContent: '', fileUrl: null, tree: tree || [], isLoading: !tree || tree.length === 0,
    terminalSessions: [{ id: defaultTerminalId, name: 'Bash' }],
    activeTerminalId: defaultTerminalId
  };
};

/**
 * Common update logic for projects in the workspace state.
 */
const updateProjectInState = (s: WorkspaceState, id: string, updates: Partial<ProjectSession>) => ({
  projects: s.projects.map(p => p.id === id ? { ...p, ...updates } : p)
});

export const projectActions = (set: any) => ({
  addProjects: (items: any[]) => set((s: WorkspaceState) => {
    const next = [...s.projects];
    items.forEach(it => {
      if (!isValidPath(it.path)) {
        
        return;
      }
      if (!next.some(p => p.id === it.path)) {
        const project = createProject(it.path, it.name, it.tree);
        if (project) next.push(project);
      }
    });
    return { projects: next };
  }),

  replaceProject: (path: string, name: string, tree: any) => set((s: WorkspaceState) => {
    if (!isValidPath(path)) {
      
      return s;
    }
    const p = createProject(path, name, tree);
    if (!p) return s;
    return { projects: [...s.projects.filter(pr => pr.id !== path), p], activeProjectId: path, showSettings: false };
  }),

  closeProject: (id: string) => set((s: WorkspaceState) => {
    const next = s.projects.filter(p => p.id !== id);
    return { 
      projects: next, 
      activeProjectId: s.activeProjectId === id ? (next[0]?.id || s.terminalOverviews[0]?.id || null) : s.activeProjectId 
    };
  }),

  updateProject: (id: string, updates: Partial<ProjectSession>) => set((s: WorkspaceState) => updateProjectInState(s, id, updates)),
  
  updateActiveProject: (updates: Partial<ProjectSession>) => set((s: WorkspaceState) => 
    s.activeProjectId ? updateProjectInState(s, s.activeProjectId, updates) : {}
  ),

  updateProjectTree: (id: string, tree: FileEntry[], images?: FileEntry[]) => set((s: WorkspaceState) => 
    updateProjectInState(s, id, { tree, imageFiles: images, isLoading: false })
  ),

  setProjectStatus: (id: string, status: ProjectStatus) => set((s: WorkspaceState) => updateProjectInState(s, id, { status })),

  setFollowedFile: (id: string, path: string | null, progress: number | null) => set((s: WorkspaceState) => 
    updateProjectInState(s, id, { followedFilePath: path, taskProgress: progress })
  ),

  setProjects: (projects: ProjectSession[]) => set({ projects }),

  addTerminalSession: (projectId: string) => set((s: WorkspaceState) => {
    const p = s.projects.find(px => px.id === projectId);
    if (!p) return s;
    
    // If no sessions exist (old project in cache), initialize with the default session
    const sessions = p.terminalSessions && p.terminalSessions.length > 0 
      ? p.terminalSessions 
      : [{ id: p.activeTerminalId || 'bash', name: 'Bash' }];
      
    const newId = `terminal-${Math.random().toString(36).substring(2, 11)}`;
    const newSessions = [...sessions, { id: newId, name: `Bash ${sessions.length + 1}` }];
    return updateProjectInState(s, projectId, { terminalSessions: newSessions, activeTerminalId: newId });
  }),

  switchTerminalSession: (projectId: string, terminalId: string) => set((s: WorkspaceState) => 
    updateProjectInState(s, projectId, { activeTerminalId: terminalId })
  ),

  closeTerminalSession: (projectId: string, terminalId: string) => set((s: WorkspaceState) => {
    const p = s.projects.find(px => px.id === projectId);
    if (!p) return s;
    const sessions = p.terminalSessions || [];
    if (sessions.length <= 1) return s;
    const newSessions = sessions.filter(ts => ts.id !== terminalId);
    let activeId = p.activeTerminalId;
    if (activeId === terminalId) activeId = newSessions[newSessions.length - 1].id;
    return updateProjectInState(s, projectId, { terminalSessions: newSessions, activeTerminalId: activeId });
  }),
});
