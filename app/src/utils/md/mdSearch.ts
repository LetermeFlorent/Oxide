
import { FileEntry } from "../../store/types";

export function findMarkdownFiles(entries: FileEntry[]): string[] {
  const files: string[] = [];
  const scan = (items: FileEntry[]) => {
    for (const item of items) {
      if (item.isFolder && item.children) scan(item.children);
      else if (!item.isFolder && item.name.toLowerCase().endsWith('.md')) files.push(item.path);
    }
  };
  scan(entries);
  return files;
}
