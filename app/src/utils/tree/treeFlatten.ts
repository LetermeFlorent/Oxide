
import { FileEntry } from "../../store/config/types";

export interface FlatEntry { entry: FileEntry; level: number; }

export const countExpandedNodes = (nodes: FileEntry[] | undefined, expanded: Record<string, boolean>): number => {
  if (!nodes?.length) return 0;
  let total = 0;
  const stack: { nodes: FileEntry[], i: number }[] = [{ nodes, i: 0 }];
  while (stack.length > 0) {
    const cur = stack[stack.length - 1];
    if (cur.i >= cur.nodes.length) { stack.pop(); continue; }
    const node = cur.nodes[cur.i++];
    total++;
    if (node.isFolder && expanded[node.path] && node.children?.length) stack.push({ nodes: node.children, i: 0 });
  }
  return total;
};

export const getVisibleFlatTree = (nodes: FileEntry[] | undefined, expanded: Record<string, boolean>, start: number, end: number): (FlatEntry & { index: number })[] => {
  if (!nodes?.length) return [];
  const res: (FlatEntry & { index: number })[] = [];
  let gIdx = 0;
  const stack: { nodes: FileEntry[], lvl: number, i: number }[] = [{ nodes, lvl: 0, i: 0 }];
  while (stack.length > 0) {
    const cur = stack[stack.length - 1];
    if (cur.i >= cur.nodes.length) { stack.pop(); continue; }
    const node = cur.nodes[cur.i++];
    if (gIdx >= start && gIdx < end) {
      // Clone entry without children to avoid massive serialization overhead
      const { children, ...sanitized } = node;
      res.push({ entry: sanitized as FileEntry, level: cur.lvl, index: gIdx });
    }
    if (gIdx >= end) break;
    gIdx++;
    if (node.isFolder && expanded[node.path] && node.children?.length) stack.push({ nodes: node.children, lvl: cur.lvl + 1, i: 0 });
  }
  return res;
};
