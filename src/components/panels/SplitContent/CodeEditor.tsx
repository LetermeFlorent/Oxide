/**
 * @file CodeEditor.tsx
 */

import { Editor } from "@monaco-editor/react";
import { memo, useCallback } from "react";
import { useFileSaving } from "../../../hooks/useFileSaving";
import { editorOptions } from "./CodeEditorOptions";

interface CodeEditorProps {
  content?: string;
  language?: string;
}

export const CodeEditor = memo(({ content, language }: CodeEditorProps) => {
  const saveFile = useFileSaving();
  
  const handleChange = useCallback((value?: string) => {
    if (value !== undefined) saveFile(value);
  }, [saveFile]);

  return (
    <div className="flex-1 relative">
      <Editor 
        height="100%" 
        language={language || "plaintext"} 
        value={content || ""} 
        theme="light" 
        loading={<div />} 
        options={editorOptions} 
        onChange={handleChange}
      />
    </div>
  );
});
