/**
 * @file CodeEditor.tsx
 * @description Monaco Editor wrapper for read-only code display
 * Provides syntax highlighting and clean viewing experience
 *
 * Features:
 * - Monaco Editor integration for syntax highlighting
 * - Read-only mode for safe file viewing
 * - Minimal UI (no minimap, no line numbers)
 * - Word wrap for better readability
 * - JetBrains Mono font for code
 *
 * @component CodeEditor
 */

import { Editor } from "@monaco-editor/react";
import { memo } from "react";

/** Monaco Editor options for clean read-only viewing */
const editorOptions: any = {
  readOnly: true, minimap: { enabled: false }, fontSize: 12,
  fontFamily: 'JetBrains Mono, Menlo, Monaco, Consolas, monospace',
  scrollBeyondLastLine: false, automaticLayout: true,
  padding: { top: 20, bottom: 20 }, lineNumbers: 'off',
  wordWrap: 'on', glyphMargin: false, folding: false,
  lineDecorationsWidth: 0, lineNumbersMinChars: 0,
  renderLineHighlight: 'none',
  overviewRulerLanes: 0,
  overviewRulerBorder: false,
  scrollbar: { vertical: 'visible', horizontal: 'visible', useShadows: false, verticalScrollbarSize: 4, horizontalScrollbarSize: 4 }
};

/**
 * Props for the CodeEditor component
 * @interface CodeEditorProps
 */
interface CodeEditorProps {
  /** Content to display in the editor */
  content?: string;
  /** Programming language for syntax highlighting */
  language?: string;
}

/**
 * CodeEditor Component
 *
 * A read-only code editor using Monaco Editor with a minimal,
 * clean interface optimized for viewing code rather than editing.
 *
 * @param props - Component props
 * @returns The code editor component
 */
export const CodeEditor = memo(({ content, language }: CodeEditorProps) => (
  <div className="flex-1 relative">
    <Editor height="100%" language={language || "plaintext"} value={content || ""} theme="light" loading={<div />} options={editorOptions} />
  </div>
));
