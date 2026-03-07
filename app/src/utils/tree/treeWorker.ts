import { getVisibleFlatTree } from "./treeUtils";
import { parseBinaryTree } from "./treeBinary";
import { filterNodes, getAllExpanded } from "./treeSearch";
import { FileEntry } from "../../store/config/types";

interface FlatEntry { entry: FileEntry; level: number; }

let cachedNodes: FileEntry[] = [];
let cachedExpanded: Record<string, boolean> = {};
let cachedQuery: string = "";
let flatTree: FlatEntry[] = [];

const rebuildFlatTree = () => {
  let nodes = cachedNodes;
  let expanded = cachedExpanded;
  
  if (cachedQuery?.trim()) {
    nodes = filterNodes(cachedNodes, cachedQuery);
    expanded = getAllExpanded(nodes);
  }

  // Flatten the tree based on expanded folders
  const res: FlatEntry[] = [];
  const stack: { nodes: FileEntry[], lvl: number, i: number }[] = [{ nodes, lvl: 0, i: 0 }];
  while (stack.length > 0) {
    const cur = stack[stack.length - 1];
    if (cur.i >= cur.nodes.length) { stack.pop(); continue; }
    const node = cur.nodes[cur.i++];
    
    // Sanitize node for UI (remove children to save memory/serialization)
    const { children, ...sanitized } = node;
    res.push({ entry: sanitized as FileEntry, level: cur.lvl });
    
    if (node.isFolder && expanded[node.path] && node.children?.length) {
      stack.push({ nodes: node.children, lvl: cur.lvl + 1, i: 0 });
    }
  }
  flatTree = res;
};

self.onmessage = (e: MessageEvent) => {
  const { type, nodes, expandedFolders, startIndex, endIndex, binaryData, searchQuery } = e.data;
  
  if (type === 'PARSE_BINARY') {
    return self.postMessage({ type: 'PARSE_BINARY_RESULT', ...parseBinaryTree(binaryData) });
  }

  let needsRebuild = false;
  if (nodes) { cachedNodes = nodes; needsRebuild = true; }
  if (expandedFolders) { cachedExpanded = expandedFolders; needsRebuild = true; }
  if (searchQuery !== undefined && searchQuery !== cachedQuery) { 
    cachedQuery = searchQuery; 
    needsRebuild = true; 
  }

  if (needsRebuild || type === 'INIT_TREE') {
    rebuildFlatTree();
  }

  if (type === 'COUNT_EXPANDED') {
    self.postMessage({ type: 'COUNT_EXPANDED_RESULT', count: flatTree.length });
  } else if (type === 'GET_VISIBLE_TREE') {
    const visibleItems = flatTree.slice(startIndex, endIndex).map((item, i) => ({
      ...item,
      index: startIndex + i
    }));
    self.postMessage({ type: 'GET_VISIBLE_TREE_RESULT', visibleItems });
  }
};
