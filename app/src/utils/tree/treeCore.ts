
import { FileEntry } from "../../store/config/types";

/**
 * Sorts nodes: Folders first, then case-insensitive alphabetical order.
 */
export const sortNodes = (nodes: FileEntry[]) => [...nodes].sort((a, b) => {
  if (a.isFolder !== b.isFolder) return a.isFolder ? -1 : 1;
  return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
});

/**
 * Normalizes file paths for consistent comparison.
 */
export const normalizePath = (p: string) => p.replace(/\\/g, '/').replace(/\/$/, '');
