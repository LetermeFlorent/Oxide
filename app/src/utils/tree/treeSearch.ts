
import { FileEntry } from "../../store/types";

const isValidEntry = (item: FileEntry): boolean => {
  return !!(item?.name && item.name.length > 0);
};

const sortNodes = (nodes: FileEntry[]) => nodes.sort((a, b) => {
  if (a.isFolder !== b.isFolder) return a.isFolder ? -1 : 1;
  return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
});

export function filterNodes(items: FileEntry[], query: string): FileEntry[] {
  const results: FileEntry[] = [];
  const q = query.toLowerCase();
  for (const item of items) {
    if (!isValidEntry(item)) continue;
    
    let matchedChildren: FileEntry[] | null = null;
    if (item.isFolder && item.children) matchedChildren = filterNodes(item.children, query);
    if (item.name.toLowerCase().includes(q) || (matchedChildren?.length)) {
      results.push({ ...item, children: matchedChildren ?? item.children });
    }
  }
  return sortNodes(results);
}

export function getAllExpanded(items: FileEntry[], expanded: Record<string, boolean> = {}): Record<string, boolean> {
  for (const it of items) {
    if (!isValidEntry(it)) continue;
    if (it.isFolder) {
      expanded[it.path] = true;
      if (it.children) getAllExpanded(it.children, expanded);
    }
  }
  return expanded;
}
