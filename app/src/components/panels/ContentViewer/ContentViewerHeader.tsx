
import { Monitor, FileCode, Columns, Target } from "lucide-react";

export const ContentViewerHeader = ({ s, fileName }: any) => (
  <div className="h-8 px-3 flex items-center justify-between shrink-0 border-b border-gray-100 transition-all duration-300">
    <div className="flex gap-1 items-center h-full">
      <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mr-4">View</span>
      {s.isMd && (
        <div className="flex items-center gap-1 h-full">
          {['preview', 'code', 'split'].map((m: any) => (
            <button key={m} onClick={() => s.setViewMode(m)} className={`flex items-center gap-1.5 px-2 h-full border-b-2 transition-all ${s.viewMode === m ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
              {m === 'preview' ? <Monitor size={12} /> : m === 'code' ? <FileCode size={12} /> : <Columns size={12} />}
              <span className="text-[9px] font-black uppercase tracking-tight">{m}</span>
            </button>
          ))}
          <div className="w-4" />
          <button onClick={s.toggleFollow} className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg transition-all active:scale-95 ${s.isFollowing ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-gray-400 hover:text-orange-500 hover:bg-orange-50'}`}>
            <Target size={12} /><span className="text-[8px] font-black uppercase tracking-widest">{s.isFollowing ? 'FOLLOWING' : 'FOLLOW'}</span>
          </button>
        </div>
      )}
    </div>
    <span className="text-[9px] font-bold text-gray-300 uppercase truncate max-w-[200px] tracking-widest">{fileName}</span>
  </div>
);
