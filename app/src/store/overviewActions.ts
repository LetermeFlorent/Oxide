
export const overviewActions = (set: any) => ({
  addTerminalOverview: (n: string, ps: string[]) => set((s: any) => {
    const id = `ov-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const uniqueIds = Array.from(new Set(ps || []));
    return { 
      terminalOverviews: [...s.terminalOverviews, { id, name: n, projectIds: uniqueIds }], 
      activeProjectId: id,
      globalTabsOrder: Array.from(new Set([...(s.globalTabsOrder || []), id]))
    };
  }),
  updateTerminalOverview: (id: string, n: string) => set((s: any) => ({ terminalOverviews: s.terminalOverviews.map((o: any) => o.id === id ? { ...o, name: n } : o) })),
  setTerminalOverviewProjects: (id: string, ps: string[]) => set((s: any) => ({ terminalOverviews: s.terminalOverviews.map((o: any) => o.id === id ? { ...o, projectIds: Array.from(new Set(ps || [])) } : o) })),
  closeTerminalOverview: (id: string) => set((s: any) => {
    const next = s.terminalOverviews.filter((o: any) => o.id !== id);
    const nextOrder = (s.globalTabsOrder || []).filter((oid: string) => oid !== id);
    const active = s.activeProjectId === id ? (s.projects[0]?.id || next[0]?.id || null) : s.activeProjectId;
    return { terminalOverviews: next, globalTabsOrder: nextOrder, activeProjectId: active };
  }),
  setTerminalOverviews: (terminalOverviews: any[]) => set({ terminalOverviews }),
});
