
import { FileEntry } from "../../store/types";
import { sortNodes, normalizePath as norm } from "./treeCore";

const isValidEntry = (entry: FileEntry): boolean => {
  return !!(entry?.name && entry.name.length > 0 && entry?.path && entry.path.length > 0);
};

export const applyFilePatch = (tree: FileEntry[], patch: { parent_path: string, added: FileEntry[], removed: string[] }): FileEntry[] => {
  const { parent_path, added, removed } = patch;
  const normParent = norm(parent_path);
  
  if (!normParent || normParent.length === 0) {
    
    return tree;
  }
  
  const cleanAdded = added.filter(isValidEntry).map(a => ({ ...a, path: norm(a.path) }));
  const cleanRemoved = removed.filter(p => p && p.length > 0);

  const updateRecursive = (nodes: FileEntry[]): FileEntry[] => {
    if (nodes.some(n => norm(n.path) === normParent)) {
      return nodes.map(node => {
        if (norm(node.path) === normParent) {
          const filtered = (node.children || []).filter(c => !cleanRemoved.includes(c.path) && !cleanAdded.some(a => a.path === c.path));
          return { ...node, children: sortNodes([...filtered, ...cleanAdded]) };
        }
        return node;
      });
    }
    return nodes.map(node => node.children ? { ...node, children: updateRecursive(node.children) } : node);
  };

  if (normParent === "" || (tree.every(n => n.path.startsWith(normParent)) && !tree.some(n => norm(n.path) === normParent))) {
    const filtered = tree.filter(c => !cleanRemoved.includes(c.path) && !cleanAdded.some(a => a.path === c.path));
    return sortNodes([...filtered, ...cleanAdded]);
  }
  return updateRecursive(tree);
};
