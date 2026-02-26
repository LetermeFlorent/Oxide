
import { useMemo } from "react";
import { useResizable } from "../../../hooks/useResizable";

export function useSplitContent(fileName: string, viewMode: string, isMd: boolean) {
  const startH = useResizable('--split-h', true);
  const isSplit = viewMode === 'split' && isMd;

  const language = useMemo(() => {
    if (!fileName) return 'plaintext';
    const ext = fileName.split('.').pop()?.toLowerCase() || 'plaintext';
    const map: any = { 
      'js': 'javascript', 'ts': 'typescript', 'tsx': 'typescript', 
      'jsx': 'javascript', 'md': 'markdown', 'json': 'json', 
      'html': 'html', 'css': 'css', 'py': 'python', 'rs': 'rust' 
    };
    return map[ext] || 'plaintext';
  }, [fileName]);

  return { startH, isSplit, language };
}
