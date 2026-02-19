/**
 * @file ContentViewer.tsx
 */

import { Monitor, FileCode, Columns, ImageIcon, Zap, Target } from "lucide-react";
import { SplitContent } from "./SplitContent";
import { memo } from "react";
import { hasTasks } from "../../utils/mdUtils";
import { Tab } from "./ContentViewer/Tab";
import { useContentViewer } from "./ContentViewer/useContentViewer";
import { motion } from "framer-motion";

export const ContentViewer = memo(({ content, fileName, fileUrl }: any) => {
  const s = useContentViewer(content, fileName);
  return (
    <div className={`flex-1 flex flex-col overflow-hidden min-w-0 bg-white ${s.compactMode ? '' : 'rounded-xl'}`}>
      <div className={`h-8 px-3 flex items-center justify-between shrink-0 border-b border-gray-100 transition-all duration-300`}>
        <div className="flex gap-4 items-center">
          <Tab active={s.viewMode === 'preview' || (!s.isMd && !fileUrl)} onClick={() => s.setViewMode('preview')} icon={s.isPdf ? Zap : (s.isImage ? ImageIcon : Monitor)} label={s.isPdf ? "PDF" : (s.isImage ? "IMAGE" : "PREVIEW")} />
          {s.isMd && <Tab active={s.viewMode === 'code'} onClick={() => s.setViewMode('code')} icon={FileCode} label="CODE" />}
          {s.isMd && <Tab active={s.viewMode === 'split'} onClick={() => s.setViewMode('split')} icon={Columns} label="SPLIT" />}
          {s.isMd && hasTasks(content) && (
            <button onClick={s.toggleFollow} className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg transition-all active:scale-95 ${s.isFollowing ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-gray-400 hover:text-orange-500 hover:bg-orange-50'}`}>
              <motion.div
                animate={s.isFollowing ? { scale: [1, 1.3, 1], rotate: [0, 15, -15, 0] } : {}}
                transition={{ duration: 0.4 }}
              >
                <Target size={12} />
              </motion.div>
              <span className="text-[8px] font-black uppercase tracking-widest">{s.isFollowing ? 'FOLLOWING' : 'FOLLOW'}</span>
            </button>
          )}
        </div>
        <span className="text-[9px] font-bold text-gray-300 uppercase truncate max-w-[200px] tracking-widest">{fileName}</span>
      </div>
      <SplitContent content={content} viewMode={s.viewMode} isMd={s.isMd} isPdf={s.isPdf} fileUrl={fileUrl} fileName={fileName} />
    </div>
  );
}, (p, n) => p.content === n.content && p.fileName === n.fileName && p.fileUrl === n.fileUrl);

ContentViewer.displayName = 'ContentViewer';
