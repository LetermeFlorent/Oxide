
import { Monitor, FileCode, Columns, Target } from "lucide-react";

export const ContentViewerHeader = ({ s, fileName }: any) => (
  <div className="h-10 px-4 flex items-center justify-between shrink-0 border-b border-border bg-panel-bg/50 backdrop-blur-md sticky top-0 z-50">
    <div className="flex gap-2 items-center h-full">
      <div className="flex items-center gap-1.5 px-2 py-1 bg-foreground/5 rounded-lg mr-2">
        <span className="text-[8px] font-black text-foreground/40 uppercase tracking-[0.2em]">View</span>
      </div>
      {s.isMd && (
        <div className="flex items-center gap-1 h-full py-1.5">
          {['preview', 'code', 'split'].map((m: any) => (
            <button key={m} onClick={() => s.setViewMode(m)} className={`flex items-center gap-1.5 px-3 h-full rounded-lg transition-all ${s.viewMode === m ? 'bg-foreground text-background shadow-sm' : 'text-foreground/40 hover:bg-foreground/5 hover:text-foreground'}`}>
              {m === 'preview' ? <Monitor size={12} /> : m === 'code' ? <FileCode size={12} /> : <Columns size={12} />}
              <span className="text-[9px] font-black uppercase tracking-tight">{m}</span>
            </button>
          ))}
          <div className="w-2" />
          <button onClick={s.toggleFollow} className={`flex items-center gap-1.5 px-3 h-full rounded-lg transition-all active:scale-95 ${s.isFollowing ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20' : 'text-foreground/40 border border-border hover:border-orange-500/50 hover:text-orange-500'}`}>
            <Target size={12} /><span className="text-[8px] font-black uppercase tracking-widest">{s.isFollowing ? 'FOLLOWING' : 'FOLLOW'}</span>
          </button>
        </div>
      )}
    </div>
    <div className="flex items-center gap-2">
      <div className="w-1.5 h-1.5 rounded-full bg-green-500/50 animate-pulse" />
      <span className="text-[9px] font-black text-foreground/30 uppercase truncate max-w-[200px] tracking-[0.1em]">{fileName}</span>
    </div>
  </div>
);
