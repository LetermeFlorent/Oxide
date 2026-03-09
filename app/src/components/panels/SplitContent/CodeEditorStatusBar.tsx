
import { memo } from "react";

interface Props {
  language?: string;
  lineCount: number;
}

export const CodeEditorStatusBar = memo(({ language, lineCount }: Props) => (
  <div className="h-6 px-4 flex items-center justify-between border-t border-border bg-panel-bg shrink-0 select-none">
    <div className="flex items-center gap-4">
      <span className="text-[8px] font-black uppercase tracking-[0.2em] text-foreground/30 italic">Oxide Editor</span>
      <div className="w-px h-2 bg-border/50" />
      <span className="text-[8px] font-bold text-foreground/40 uppercase tracking-widest">{language || 'plaintext'}</span>
    </div>
    <div className="flex items-center gap-3">
      <span className="text-[8px] font-medium text-foreground/30 uppercase tracking-widest">{lineCount} Lines</span>
    </div>
  </div>
));

CodeEditorStatusBar.displayName = 'CodeEditorStatusBar';
