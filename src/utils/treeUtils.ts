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

import { FileEntry } from "../store/useStore";

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
 * Flattens a nested file tree into a linear array
 * Respects folder expansion state for virtualized rendering
 * 
 * @param nodes - Tree nodes to flatten
 * @param expandedFolders - Map of expanded folder paths
 * @param level - Current nesting level (for recursion)
 * @param result - Accumulator array (for recursion)
 * @returns Flattened array of entries with nesting levels
 * 
 * @example
 * const flat = flattenTree(tree, { '/folder': true });
 * // Returns: [{ entry: folder, level: 0 }, { entry: child, level: 1 }]
 */
export const flattenTree = (
  nodes: FileEntry[] | undefined,
  expandedFolders: Record<string, boolean>,
  level = 0,
  result: FlatEntry[] = []
): FlatEntry[] => {
  if (!nodes || !Array.isArray(nodes)) return result;
  for (const node of nodes) {
    result.push({ entry: node, level });
    if (node.isFolder && expandedFolders[node.path] && node.children) {
      flattenTree(node.children, expandedFolders, level + 1, result);
    }
  }
  return result;
};
