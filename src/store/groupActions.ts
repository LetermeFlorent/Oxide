export const groupActions = (set: any) => ({
  createGroup: (n: string, ids?: string[]) => set((s: any) => {
    const gid = `g-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    return { 
      groups: [...s.groups, { id: gid, name: n, collapsed: false }], 
      projects: s.projects.map((p: any) => ids?.includes(p.id) ? { ...p, groupId: gid } : p), 
      terminalOverviews: s.terminalOverviews.map((o: any) => ids?.includes(o.id) ? { ...o, groupId: gid } : o) 
    };
  }),
  renameGroup: (id: string, n: string) => set((s: any) => ({ groups: s.groups.map((g: any) => g.id === id ? { ...g, name: n } : g) })),
  toggleGroup: (id: string) => set((s: any) => ({ groups: s.groups.map((g: any) => g.id === id ? { ...g, collapsed: !g.collapsed } : g) })),
  moveToGroup: (iid: string, gid: string | null) => set((s: any) => ({ 
    projects: s.projects.map((p: any) => p.id === iid ? { ...p, groupId: gid || undefined } : p), 
    terminalOverviews: s.terminalOverviews.map((o: any) => o.id === iid ? { ...o, groupId: gid || undefined } : o) 
  })),
  deleteGroup: (id: string) => set((s: any) => ({ 
    groups: s.groups.filter((g: any) => g.id !== id), 
    projects: s.projects.map((p: any) => p.groupId === id ? { ...p, groupId: undefined } : p), 
    terminalOverviews: s.terminalOverviews.map((o: any) => o.groupId === id ? { ...o, groupId: undefined } : o) 
  })),
});
