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
  const { type, nodes, expandedFolders, startIndex, endIndex, binaryData } = e.data;

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

  if (type === 'COUNT_EXPANDED') {
    self.postMessage({ type: 'COUNT_EXPANDED_RESULT', count: countExpandedNodes(nodes, expandedFolders) });
  } else if (type === 'GET_VISIBLE_TREE') {
    self.postMessage({ type: 'GET_VISIBLE_TREE_RESULT', visibleItems: getVisibleFlatTree(nodes, expandedFolders, startIndex, endIndex) });
  }
};
