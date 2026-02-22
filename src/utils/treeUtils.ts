/**
 * @file treeUtils.ts
 * @description File tree utility functions for virtualized rendering
 * Flattens nested tree structures for efficient list rendering
 * 
 * Features:
 * - Tree flattening with expansion state support
 * - Level tracking for indentation
 * - Virtualization-friendly output format
 * 
 * @module utils/treeUtils
 */

import { FileEntry } from "../store/types";

/**
 * Represents a flattened tree entry with nesting level
 * @interface FlatEntry
 */
export interface FlatEntry {
  /** The file/folder entry */
  entry: FileEntry;
  /** Nesting level (0 = root) */
  level: number;
}

/**
 * Merges a new tree branch into an existing tree while preserving children.
 * If a folder in the new tree has empty children but the old one has some,
 * we keep the old children to avoid "disappearing" subfolders.
 * 
 * Updated to support merging (union) for flat lists, which is critical for
 * chunked streaming of the root directory.
 */
export const mergeTrees = (oldNodes: FileEntry[], newNodes: FileEntry[]): FileEntry[] => {
  if (!oldNodes.length) return newNodes;
  
  // Map of existing nodes for fast lookup
  const oldMap = new Map(oldNodes.map(node => [node.path, node]));
  const result: FileEntry[] = [];
  
  // Track which old nodes we've seen in the new scan
  const seenOldPaths = new Set<string>();

  // Process all new nodes
  for (const newNode of newNodes) {
    const oldNode = oldMap.get(newNode.path);
    if (oldNode) {
      seenOldPaths.add(newNode.path);
      if (newNode.isFolder) {
        // If the new scan says empty children, but we had children loaded, keep them
        const hasNoNewChildren = !newNode.children || newNode.children.length === 0;
        const hadChildren = oldNode.children && oldNode.children.length > 0;
        
        let mergedChildren = newNode.children;
        if (hasNoNewChildren && hadChildren) {
          mergedChildren = oldNode.children;
        } else if (newNode.children && oldNode.children) {
          mergedChildren = mergeTrees(oldNode.children, newNode.children);
        }
        
        result.push({ ...newNode, children: mergedChildren });
      } else {
        result.push(newNode);
      }
    } else {
      result.push(newNode);
    }
  }

  // Critical: Keep old nodes that were NOT in the new scan (for chunking/streaming)
  for (const oldNode of oldNodes) {
    if (!seenOldPaths.has(oldNode.path)) {
      // Avoid duplicates if multiple chunks have same items (unlikely but safe)
      const isDuplicate = newNodes.some(n => n.path === oldNode.path);
      if (!isDuplicate) result.push(oldNode);
    }
  }

  // Sort them: folders first, then alphabetically
  result.sort((a, b) => {
    if (a.isFolder === b.isFolder) return a.name.localeCompare(b.name);
    return a.isFolder ? -1 : 1;
  });

  return result;
};

/**
 * Applies a FilePatch from Rust to the tree
 */
export const applyFilePatch = (tree: FileEntry[], patch: { parent_path: string, added: FileEntry[], removed: string[] }): FileEntry[] => {
  const { parent_path, added, removed } = patch;
  
  // Normalize parent path
  const normParent = parent_path.replace(/\\/g, '/').replace(/\/$/, '');
  
  // Sanitize added nodes: ensure they have paths and names
  const cleanAdded = added.filter(a => a.name && a.path).map(a => ({
    ...a,
    path: a.path.replace(/\\/g, '/').replace(/\/$/, '')
  }));

  const updateRecursive = (nodes: FileEntry[]): FileEntry[] => {
    // If this is the parent folder being patched
    const targetNode = nodes.find(n => {
      const nodeNorm = n.path.replace(/\\/g, '/').replace(/\/$/, '');
      return nodeNorm === normParent;
    });

    if (targetNode && targetNode.isFolder) {
      return nodes.map(node => {
        const nodeNorm = node.path.replace(/\\/g, '/').replace(/\/$/, '');
        if (nodeNorm === normParent) {
          const currentChildren = node.children || [];
          const filtered = currentChildren.filter((c: FileEntry) => !removed.includes(c.path));
          
          // Avoid adding duplicates
          const addedPaths = cleanAdded.map(a => a.path);
          const finalFiltered = filtered.filter((c: FileEntry) => !addedPaths.includes(c.path));
          
          const updated = [...finalFiltered, ...cleanAdded];
          // Sort children: folders first, then alphabetically
          updated.sort((a, b) => {
            if (a.isFolder === b.isFolder) return a.name.localeCompare(b.name);
            return a.isFolder ? -1 : 1;
          });
          return { ...node, children: updated };
        }
        return node;
      });
    }

    // Otherwise recurse
    return nodes.map(node => {
      if (node.children) {
        const updatedChildren = updateRecursive(node.children);
        if (updatedChildren !== node.children) {
          return { ...node, children: updatedChildren };
        }
      }
      return node;
    });
  };

  // If patching the root
  const rootHeuristic = normParent === "" || tree.every(n => n.path.startsWith(normParent));
  if (rootHeuristic) {
     const rootMatch = tree.find(n => n.path.replace(/\\/g, '/').replace(/\/$/, '') === normParent);
     if (!rootMatch) {
        console.log("[treeUtils] Patching root level for:", normParent);
        const filtered = tree.filter((c: FileEntry) => !removed.includes(c.path));
        
        const addedPaths = cleanAdded.map(a => a.path);
        const finalFiltered = filtered.filter((c: FileEntry) => !addedPaths.includes(c.path));
        
        const updated = [...finalFiltered, ...cleanAdded];
        updated.sort((a, b) => {
          if (a.isFolder === b.isFolder) return a.name.localeCompare(b.name);
          return a.isFolder ? -1 : 1;
        });
        return updated;
     }
  }

  return updateRecursive(tree);
};

/**
 * Flattens a nested file tree into a linear array iteratively
 * Respects folder expansion state for virtualized rendering.
 * Optimized for large trees to avoid stack overflow.
 * 
 * @param nodes - Tree nodes to flatten
 * @param expandedFolders - Map of expanded folder paths
 * @returns Flattened array of entries with nesting levels
 */
export const flattenTree = (
  nodes: FileEntry[] | undefined,
  expandedFolders: Record<string, boolean>
): FlatEntry[] => {
  if (!nodes || !Array.isArray(nodes)) return [];
  
  const result: FlatEntry[] = [];
  const stack: { nodes: FileEntry[], level: number, index: number }[] = [
    { nodes, level: 0, index: 0 }
  ];

  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    
    if (current.index >= current.nodes.length) {
      stack.pop();
      continue;
    }

    const node = current.nodes[current.index];
    result.push({ entry: node, level: current.level });
    current.index++;

    if (node.isFolder && expandedFolders[node.path] && node.children && node.children.length > 0) {
      stack.push({ nodes: node.children, level: current.level + 1, index: 0 });
    }
  }

  return result;
};

/**
 * Counts total number of visible nodes in an expanded tree without flattening it.
 * Highly efficient for calculating total height for virtualization.
 */
export const countExpandedNodes = (
  nodes: FileEntry[] | undefined,
  expandedFolders: Record<string, boolean>
): number => {
  if (!nodes || !Array.isArray(nodes)) return 0;
  
  let total = 0;
  const stack: { nodes: FileEntry[], index: number }[] = [
    { nodes, index: 0 }
  ];

  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    
    if (current.index >= current.nodes.length) {
      stack.pop();
      continue;
    }

    const node = current.nodes[current.index];
    total++;
    current.index++;

    if (node.isFolder && expandedFolders[node.path] && node.children && node.children.length > 0) {
      stack.push({ nodes: node.children, index: 0 });
    }
  }

  return total;
};

/**
 * Highly optimized partial flattener.
 * Only processes and returns items within the requested start/end index range.
 * This is the core of data-driven virtualization.
 */
export const getVisibleFlatTree = (
  nodes: FileEntry[] | undefined,
  expandedFolders: Record<string, boolean>,
  startIndex: number,
  endIndex: number
): (FlatEntry & { index: number })[] => {
  if (!nodes || !Array.isArray(nodes)) return [];
  
  const result: (FlatEntry & { index: number })[] = [];
  let globalIdx = 0;
  
  const stack: { nodes: FileEntry[], level: number, index: number }[] = [
    { nodes, level: 0, index: 0 }
  ];

  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    
    if (current.index >= current.nodes.length) {
      stack.pop();
      continue;
    }

    const node = current.nodes[current.index];
    
    // Only capture if within range
    if (globalIdx >= startIndex && globalIdx < endIndex) {
      result.push({ entry: node, level: current.level, index: globalIdx });
    }
    
    // Stop early if we passed the range
    if (globalIdx >= endIndex) break;

    globalIdx++;
    current.index++;

    if (node.isFolder && expandedFolders[node.path] && node.children && node.children.length > 0) {
      stack.push({ nodes: node.children, level: current.level + 1, index: 0 });
    }
  }

  return result;
};
