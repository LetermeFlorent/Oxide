
import { FileEntry } from "../../store/config/types";
import { sortNodes } from "./treeCore";

const isValidNode = (node: FileEntry): boolean => {
  return !!(node?.path && node.path.length > 0 && node?.name && node.name.length > 0);
};

export const mergeTrees = (oldNodes: FileEntry[], newNodes: FileEntry[]): FileEntry[] => {
  if (!newNodes.length) return [];
  
  const validOldNodes = oldNodes.filter(isValidNode);
  const validNewNodes = newNodes.filter(isValidNode);
  
  if (!validOldNodes.length) return sortNodes([...validNewNodes]);
  if (!validNewNodes.length) return [];
  
  const oldMap = new Map(validOldNodes.map(n => [n.path, n]));
  
  const result = validNewNodes.map(newNode => {
    const oldNode = oldMap.get(newNode.path);
    if (newNode.isFolder && oldNode?.isFolder) {
      // If we have children in the old node but not in the new one (shallow scan), keep them
      if (!newNode.children?.length && oldNode.children?.length) {
        return { ...newNode, children: oldNode.children };
      }
      // If both have children, merge them recursively
      if (newNode.children?.length && oldNode.children?.length) {
        return { ...newNode, children: mergeTrees(oldNode.children, newNode.children) };
      }
    }
    return newNode;
  });

  return sortNodes(result);
};
