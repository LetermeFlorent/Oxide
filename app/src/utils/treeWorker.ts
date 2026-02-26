
import { countExpandedNodes, getVisibleFlatTree } from "./treeUtils";
import { parseBinaryTree } from "./tree/treeBinary";
import { filterNodes, getAllExpanded } from "./tree/treeSearch";

self.onmessage = (e: MessageEvent) => {
  const { type, nodes, expandedFolders, startIndex, endIndex, binaryData, searchQuery } = e.data;
  if (type === 'PARSE_BINARY') return self.postMessage({ type: 'PARSE_BINARY_RESULT', ...parseBinaryTree(binaryData) });

  let finalNodes = nodes;
  let finalExpanded = expandedFolders;
  if (searchQuery?.trim()) {
    finalNodes = filterNodes(nodes || [], searchQuery);
    if (type === 'GET_VISIBLE_TREE' || type === 'COUNT_EXPANDED') finalExpanded = getAllExpanded(finalNodes);
  }

  if (type === 'COUNT_EXPANDED') {
    self.postMessage({ type: 'COUNT_EXPANDED_RESULT', count: countExpandedNodes(finalNodes, finalExpanded) });
  } else if (type === 'GET_VISIBLE_TREE') {
    self.postMessage({ type: 'GET_VISIBLE_TREE_RESULT', visibleItems: getVisibleFlatTree(finalNodes, finalExpanded, startIndex, endIndex) });
  }
};
