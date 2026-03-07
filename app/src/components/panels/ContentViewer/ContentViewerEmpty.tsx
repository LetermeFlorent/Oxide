
import { FileSearch } from "lucide-react";

export const ContentViewerEmpty = ({ compactMode }: { compactMode: boolean }) => (
  <div className={`flex-1 flex flex-col items-center justify-center overflow-hidden min-w-0 bg-panel-bg ${compactMode ? '' : 'rounded-xl'}`}>
    <div className="flex flex-col items-center gap-4 opacity-20">
      <div className="p-6 bg-sidebar-bg rounded-full"><FileSearch size={48} className="text-foreground" /></div>
      <div className="flex flex-col items-center gap-1">
        <span className="text-xs font-black uppercase tracking-[0.2em]">No file selected</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">Select a file from the explorer to preview</span>
      </div>
    </div>
  </div>
);
