
import { useEffect } from "react";

export function useKeyboardShortcuts(onUndo: () => void) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) {
        const tag = document.activeElement?.tagName || '';
        const isInput = ['INPUT', 'TEXTAREA'].includes(tag);
        const isMonaco = document.activeElement?.closest('.monaco-editor');
        if (!isInput && !isMonaco) {
          e.preventDefault();
          onUndo();
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onUndo]);
}
