/**
 * @file CodeEditor.tsx
 */

import { Editor } from "@monaco-editor/react";
import { memo, useCallback, useState } from "react";
import { useStore } from "../../../store/useStore";
import { useFileSaving } from "../../../hooks/useFileSaving";
import { editorOptions } from "./CodeEditorOptions";
import { CodeEditorStatusBar } from "./CodeEditorStatusBar";

export const CodeEditor = memo(({ content, language }: { content?: string, language?: string }) => {
  const saveFile = useFileSaving();
  const isDark = useStore(s => s.isDark);
  const [lineCount, setLineCount] = useState(1);
  
  const handleEditorWillMount = useCallback((monaco: any) => {
    const colors = isDark ? { bg: '#1c1c1e', line: '#2c2c2e', num: '#48484a', act: '#f5f5f7' } : { bg: '#ffffff', line: '#f5f5f7', num: '#c7c7cc', act: '#1c1c1e' };
    monaco.editor.defineTheme('oxide', { base: isDark ? 'vs-dark' : 'vs', inherit: true, rules: [], colors: { 'editor.background': colors.bg, 'editor.lineHighlightBackground': colors.line, 'editorLineNumber.foreground': colors.num, 'editorLineNumber.activeForeground': colors.act, 'editorGutter.background': colors.bg } });
  }, [isDark]);

  const handleEditorDidMount = useCallback((editor: any) => {
    setLineCount(editor.getModel()?.getLineCount() || 1);
    editor.onDidChangeModelContent(() => setLineCount(editor.getModel()?.getLineCount() || 1));
  }, []);

  return (
    <div className="flex-1 flex flex-col min-h-0 h-full overflow-hidden">
      <div className="flex-1 relative">
        <Editor height="100%" language={language || "plaintext"} value={content || ""} theme="oxide" options={editorOptions} onChange={(v) => v !== undefined && saveFile(v)} beforeMount={handleEditorWillMount} onMount={handleEditorDidMount} loading={<div className="h-full bg-panel-bg flex items-center justify-center text-[10px] font-bold opacity-20">LOADING...</div>} />
      </div>
      <CodeEditorStatusBar language={language} lineCount={lineCount} />
    </div>
  );
});
