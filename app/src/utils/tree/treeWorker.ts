import { countExpandedNodes, getVisibleFlatTree } from "./treeUtils";
import { parseBinaryTree } from "./treeBinary";
import { filterNodes, getAllExpanded } from "./treeSearch";

let cachedNodes: any[] = [];
let cachedExpanded: any = {};
let cachedQuery: string = "";

self.onmessage = (e: MessageEvent) => {
  const { type, nodes, expandedFolders, startIndex, endIndex, binaryData, searchQuery } = e.data;
  if (type === 'PARSE_BINARY') return self.postMessage({ type: 'PARSE_BINARY_RESULT', ...parseBinaryTree(binaryData) });

  // Update cache if new data is provided, otherwise reuse
  if (nodes) cachedNodes = nodes;
  if (expandedFolders) cachedExpanded = expandedFolders;
  if (searchQuery !== undefined) cachedQuery = searchQuery;

  let finalNodes = cachedNodes;
  let finalExpanded = cachedExpanded;
  
  if (cachedQuery?.trim()) {
    finalNodes = filterNodes(cachedNodes || [], cachedQuery);
    if (type === 'GET_VISIBLE_TREE' || type === 'COUNT_EXPANDED') finalExpanded = getAllExpanded(finalNodes);
  }

  if (type === 'COUNT_EXPANDED') {
    self.postMessage({ type: 'COUNT_EXPANDED_RESULT', count: countExpandedNodes(finalNodes, finalExpanded) });
  } else if (type === 'GET_VISIBLE_TREE') {
    const visibleItems = getVisibleFlatTree(finalNodes, finalExpanded, startIndex, endIndex);
    // Sanitize results to ensure each item has a valid path
    const cleanItems = visibleItems.filter(i => i.entry?.path && i.entry.path.length > 0);
    self.postMessage({ type: 'GET_VISIBLE_TREE_RESULT', visibleItems: cleanItems });
  }
};
