
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import React, { memo, useCallback, useRef } from "react";
import { useFileSaving } from "../../../hooks/useFileSaving";
import { toggleTaskAtIndex } from "../../../utils/mdUtils";

export const MarkdownView = memo(({ content }: { content: string }) => {
  const saveFile = useFileSaving();
  const containerRef = useRef<HTMLDivElement>(null);

  const onCheckboxToggle = useCallback((target: HTMLInputElement) => {
    if (!containerRef.current) return;
    const checkboxes = Array.from(containerRef.current.querySelectorAll('input[type="checkbox"]'));
    const index = checkboxes.indexOf(target);
    if (index !== -1) {
      const newContent = toggleTaskAtIndex(content, index);
      saveFile(newContent);
    }
  }, [content, saveFile]);

  return (
    <div className="flex-1 relative bg-panel-bg select-text">
      <div ref={containerRef} className="absolute inset-0 overflow-y-auto scrollbar-modern-thin p-8">
        <div className="prose-oxide max-w-3xl mx-auto pb-20">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]} 
            rehypePlugins={[rehypeRaw]}
            components={{
              input: ({ node, ...props }) => {
                if (props.type === 'checkbox') {
                  return (
                    <input 
                      {...props} 
                      disabled={false} 
                      readOnly={false} 
                      className="cursor-pointer mx-1 scale-110 active:scale-95 transition-transform" 
                      onChange={(e) => onCheckboxToggle(e.target as HTMLInputElement)}
                    />
                  );
                }
                return <input {...props} />;
              }
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
});
