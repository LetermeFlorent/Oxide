/**
 * @file treeWorker.ts
 */

import { countExpandedNodes, getVisibleFlatTree } from "./treeUtils";
import { FileEntry } from "../store/types";

interface ParserState { offset: number; }

function parseSubNode(buffer: Uint8Array, view: DataView, state: ParserState): FileEntry {
  const isFolder = buffer[state.offset] === 1;
  state.offset += 1;
  const nameLen = view.getUint32(state.offset, true); state.offset += 4;
  const pathLen = view.getUint32(state.offset, true); state.offset += 4;
  const childrenCount = view.getUint32(state.offset, true); state.offset += 4;
  
  const name = new TextDecoder().decode(buffer.subarray(state.offset, state.offset + nameLen));
  state.offset += nameLen;
  const path = new TextDecoder().decode(buffer.subarray(state.offset, state.offset + pathLen));
  state.offset += pathLen;

  const node: FileEntry = { name: name || "unknown", path: path || `error-${state.offset}`, isFolder };
  if (isFolder) {
    node.children = [];
    for (let i = 0; i < (childrenCount as number); i++) {
      node.children.push(parseSubNode(buffer, view, state));
    }
  }
  return node;
}

self.onmessage = (e: MessageEvent) => {
  const { type, nodes, expandedFolders, startIndex, endIndex, binaryData, searchQuery } = e.data;

  if (type === 'PARSE_BINARY') {
    const view = new DataView(binaryData.buffer, binaryData.byteOffset, binaryData.byteLength);
    let offset = 0;
    const state: ParserState = { offset };
    const treeCount = view.getUint32(state.offset, true); state.offset += 4;
    const tree: FileEntry[] = [];
    for (let i = 0; i < treeCount; i++) tree.push(parseSubNode(binaryData, view, state));
    
    const imageCount = view.getUint32(state.offset, true); state.offset += 4;
    const images: FileEntry[] = [];
    for (let i = 0; i < imageCount; i++) images.push(parseSubNode(binaryData, view, state));
    
    self.postMessage({ type: 'PARSE_BINARY_RESULT', tree, images });
    return;
  }

  // Optimize: filter nodes if there's a search query
  let finalNodes = nodes;
  if (searchQuery && searchQuery.trim() !== "") {
    const q = searchQuery.toLowerCase();
    const filterNodes = (items: FileEntry[]): FileEntry[] => {
      const results: FileEntry[] = [];
      for (const item of items) {
        let matchedChildren: FileEntry[] | null = null;
        if (item.isFolder && item.children) {
          matchedChildren = filterNodes(item.children);
        }
        
        const nameMatches = item.name.toLowerCase().includes(q);
        if (nameMatches || (matchedChildren && matchedChildren.length > 0)) {
          results.push({ ...item, children: matchedChildren });
        }
      }
      return results;
    };
    finalNodes = filterNodes(nodes || []);
    // Auto-expand all folders when searching
    if (type === 'GET_VISIBLE_TREE' || type === 'COUNT_EXPANDED') {
      const allExpanded: Record<string, boolean> = {};
      const collectFolders = (items: FileEntry[]) => {
        for (const it of items) {
          if (it.isFolder) { allExpanded[it.path] = true; if (it.children) collectFolders(it.children); }
        }
      };
      collectFolders(finalNodes);
      
      if (type === 'COUNT_EXPANDED') {
        self.postMessage({ type: 'COUNT_EXPANDED_RESULT', count: countExpandedNodes(finalNodes, allExpanded) });
      } else {
        self.postMessage({ type: 'GET_VISIBLE_TREE_RESULT', visibleItems: getVisibleFlatTree(finalNodes, allExpanded, startIndex, endIndex) });
      }
      return;
    }
  }

  if (type === 'COUNT_EXPANDED') {
    self.postMessage({ type: 'COUNT_EXPANDED_RESULT', count: countExpandedNodes(finalNodes, expandedFolders) });
  } else if (type === 'GET_VISIBLE_TREE') {
    self.postMessage({ type: 'GET_VISIBLE_TREE_RESULT', visibleItems: getVisibleFlatTree(finalNodes, expandedFolders, startIndex, endIndex) });
  }
};
