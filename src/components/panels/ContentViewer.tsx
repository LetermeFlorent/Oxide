/**
 * @file ContentViewer.tsx
 * @description Main content viewing area with tabbed view modes
 * Handles code preview, markdown rendering, PDF viewing, and task following
 * 
 * Features:
 * - Multi-mode viewing (preview, code, split view)
 * - File type detection (markdown, PDF, images)
 * - Task following system for markdown files with checkboxes
 * - View mode persistence per session
 * - Progress tracking integration
 * 
 * @component ContentViewer
 * @example
 * <ContentViewer 
 *   content={fileContent} 
 *   fileName="readme.md" 
 *   fileUrl={blobUrl} 
 * />
 */

import { Monitor, FileCode, Columns, ImageIcon, Zap, Target } from "lucide-react";
import { useStore } from "../../store/useStore";
import { SplitContent } from "./SplitContent";
import { memo, useMemo, useCallback } from "react";
import { calculateTaskProgress, hasTasks } from "../../utils/mdUtils";

/**
 * ContentViewer Component
 * 
 * Main content area that adapts its interface based on file type.
 * Provides tabbed navigation between different view modes.
 * 
 * @param {Object} props - Component props
 * @param {string} props.content - The text content of the file
 * @param {string} [props.fileName] - Name of the currently selected file
 * @param {string} [props.fileUrl] - Blob URL for binary files (images/PDFs)
 * @returns {JSX.Element} The content viewer interface
 */
export const ContentViewer = memo(({ content, fileName, fileUrl }: any) => {
  const activeProjectId = useStore(s => s.activeProjectId);
  const project = useStore(s => s.projects.find(p => p.id === activeProjectId));
  const viewMode = useStore(s => s.viewMode);
  const setViewMode = useStore(s => s.setViewMode);
  const updateActiveProject = useStore(s => s.updateActiveProject);
  const compactMode = useStore(s => s.compactMode);
  
  // Detect file types for conditional rendering
  const isMd = useMemo(() => fileName?.toLowerCase().endsWith('.md') ?? false, [fileName]);
  const isPdf = useMemo(() => fileName?.toLowerCase().endsWith('.pdf') ?? false, [fileName]);
  const isImage = useMemo(() => {
    if (!fileName) return false;
    const lower = fileName.toLowerCase();
    return ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].some(ext => lower.endsWith(ext));
  }, [fileName]);

  // Check if currently following the selected file for task progress
  const isFollowing = project?.followedFilePath === project?.selectedFile?.path;

  /**
   * Toggle task following for the current markdown file
   * When following, task progress is calculated and displayed in the UI
   */
  const toggleFollow = useCallback(() => {
    if (!project || !project.selectedFile) return;
    
    if (isFollowing) {
      // Unfollow: Clear followed file and progress
      updateActiveProject({ followedFilePath: null, taskProgress: null });
    } else {
      // Follow: Set followed file and calculate initial progress
      const progress = calculateTaskProgress(content);
      updateActiveProject({ followedFilePath: project.selectedFile.path, taskProgress: progress });
    }
  }, [project, isFollowing, content, updateActiveProject]);

  return (
    <div className={`flex-1 flex flex-col overflow-hidden min-w-0 bg-white ${compactMode ? '' : 'rounded-xl'}`}>
      <div className={`h-8 px-3 flex items-center justify-between shrink-0 border-b border-gray-100 transition-all duration-300`}>
        <div className="flex gap-4 items-center">
          <Tab 
            active={viewMode === 'preview' || (!isMd && !fileUrl)} 
            onClick={() => setViewMode('preview')} 
            icon={isPdf ? Zap : (isImage ? ImageIcon : Monitor)} 
            label={isPdf ? "PDF" : (isImage ? "IMAGE" : "PREVIEW")} 
          />
          {isMd && <Tab active={viewMode === 'code'} onClick={() => setViewMode('code')} icon={FileCode} label="CODE" />}
          {isMd && <Tab active={viewMode === 'split'} onClick={() => setViewMode('split')} icon={Columns} label="SPLIT" />}
          
          {/* Task follow button - only shown for markdown files with tasks */}
          {isMd && hasTasks(content) && (
            <button 
              onClick={toggleFollow}
              title={isFollowing ? "Unfollow" : "Follow tasks"}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg transition-all ${isFollowing ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-orange-500 hover:bg-orange-50'}`}
            >
              <Target size={12} className={isFollowing ? 'animate-pulse' : ''} />
              <span className="text-[8px] font-black uppercase tracking-widest">{isFollowing ? 'FOLLOWING' : 'FOLLOW'}</span>
            </button>
          )}
        </div>
        <span className="text-[9px] font-bold text-gray-300 uppercase truncate max-w-[200px] tracking-widest">{fileName}</span>
      </div>
      <SplitContent content={content} viewMode={viewMode} isMd={isMd} isPdf={isPdf} fileUrl={fileUrl} fileName={fileName} />
    </div>
  );
}, (prev, next) => {
  // Custom comparison to prevent unnecessary re-renders
  return prev.content === next.content && prev.fileName === next.fileName && prev.fileUrl === next.fileUrl;
});

ContentViewer.displayName = 'ContentViewer';

/**
 * Tab Component
 * 
 * Individual tab button for switching view modes.
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.active - Whether this tab is currently active
 * @param {() => void} props.onClick - Click handler
 * @param {React.ComponentType} props.icon - Lucide icon component
 * @param {string} props.label - Tab label text
 * @returns {JSX.Element} The tab button
 */
const Tab = memo(({ active, onClick, icon: Icon, label }: any) => (
  <button onClick={onClick} className={`flex items-center gap-1.5 text-[9px] font-black tracking-widest transition-all duration-200 ${active ? 'text-indigo-600 scale-105' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50 px-1 rounded'}`}>
    <Icon size={12} /> {label}
  </button>
));

Tab.displayName = 'Tab';
