
export const migrateStore = (persisted: any, version: number) => {
  if (!persisted || typeof persisted !== 'object') return persisted;

  if (version < 4) {
    if (Array.isArray(persisted.projects)) {
      persisted.projects = persisted.projects.filter((p: any) => p?.id?.trim());
    }
    if (Array.isArray(persisted.terminalOverviews)) {
      persisted.terminalOverviews = persisted.terminalOverviews.filter((o: any) => o?.id?.trim());
    }
    if (persisted.activeProjectId === "") persisted.activeProjectId = null;
  }
  
  // Only clean tree if version is old or if we suspect corruption
  if (version < 5) {
    persisted.projects = (persisted.projects || []).map((p: any) => ({
      ...p,
      tree: cleanTree(p.tree)
    }));
  }
  
  return persisted;
};

const cleanTree = (tree: any[] | null | undefined): any[] => {
  if (!Array.isArray(tree)) return [];
  
  const isValidEntry = (entry: any): boolean => {
    return !!(entry?.name && entry.name.length > 0 && entry?.path && entry.path.length > 0);
  };
  
  return tree.filter(isValidEntry).map(node => ({
    ...node,
    children: cleanTree(node.children)
  }));
};
