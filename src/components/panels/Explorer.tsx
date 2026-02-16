/**
 * @file Explorer.tsx
 * @description File tree item component with task following support
 * Renders individual file/folder entries in the project tree
 * 
 * Features:
 * - Folder expansion/collapse with chevron indicators
 * - File type icons (PDF, markdown, generic files)
 * - Task following integration for markdown files with checkboxes
 * - Context menu for follow/unfollow actions
 * - Visual indicators for selected and followed files
 * 
 * @component TreeItem
 * @example
 * <TreeItem 
 *   entry={fileEntry}
 *   onClick={handleFileClick}
 *   level={2}
 * />
 */

import { ChevronRight, ChevronDown, Folder, FileText, File, Target } from "lucide-react";
import { useState, memo, useCallback, useMemo, useEffect } from "react";
import { useStore, FileEntry } from "../../store/useStore";
import { readTextFile } from "@tauri-apps/plugin-fs";
import { calculateTaskProgress, hasTasks } from "../../utils/mdUtils";
import { motion, AnimatePresence } from "framer-motion";

/**
 * TreeItem Component
 * 
 * Individual file or folder entry in the project tree.
 * Supports folder expansion, file selection, and task following.
 * 
 * @param {Object} props - Component props
 * @param {FileEntry} props.entry - The file/folder entry data
 * @param {(e: FileEntry) => void} props.onClick - Callback when item is clicked
 * @param {number} [props.level=0] - Nesting level for indentation
 * @returns {JSX.Element} The tree item interface
 */
export const TreeItem = memo(({ entry, onClick, level = 0 }: { entry: FileEntry, onClick: (e: FileEntry) => void, level?: number }) => {
  const [menuPos, setMenuPos] = useState<{ x: number, y: number } | null>(null);
  const [canFollow, setCanFollow] = useState(false);
  
  const activeProjectId = useStore(s => s.activeProjectId);
  const projects = useStore(s => s.projects) || [];
  const activeProject = projects.find(p => p.id === activeProjectId);
  const setFollowedFile = useStore(s => s.setFollowedFile);
  const expandedFolders = useStore(s => s.expandedFolders);
  const toggleFolder = useStore(s => s.toggleFolder);
  
  const isOpen = !!expandedFolders[entry.path];
  const isSelected = activeProject?.selectedFile?.path === entry.path;
  const isPdf = useMemo(() => entry.name.toLowerCase().endsWith('.pdf'), [entry.name]);
  const isMd = useMemo(() => entry.name.toLowerCase().endsWith('.md'), [entry.name]);
  const isFollowing = activeProject?.followedFilePath === entry.path;

  /**
   * Check if markdown file has tasks that can be followed
   * Reads file content on mount to determine follow eligibility
   */
  useEffect(() => {
    if (isMd) {
      readTextFile(entry.path).then(content => {
        setCanFollow(hasTasks(content));
      }).catch(() => setCanFollow(false));
    }
  }, [entry.path, isMd]);

  /**
   * Handle click on the tree item
   * Toggles folder expansion or selects the file
   * 
   * @param {React.MouseEvent} e - Click event
   */
  const handleAction = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (entry.isFolder) toggleFolder(entry.path);
    await onClick(entry);
  }, [entry, onClick, toggleFolder]);

  /**
   * Handle right-click context menu
   * Only shows menu for markdown files with tasks
   * 
   * @param {React.MouseEvent} e - Context menu event
   */
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    if (isMd && canFollow) {
      e.preventDefault();
      e.stopPropagation();
      setMenuPos({ x: e.clientX, y: e.clientY });
    }
  }, [isMd, canFollow]);

  /**
   * Handle follow/unfollow action from context menu
   * Calculates task progress when following
   * 
   * @param {React.MouseEvent} e - Click event
   */
  const handleFollow = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuPos(null);
    if (!activeProjectId) return;
    
    const content = await readTextFile(entry.path);
    const progress = calculateTaskProgress(content);
    setFollowedFile(activeProjectId, isFollowing ? null : entry.path, isFollowing ? null : progress);
  }, [activeProjectId, entry.path, isFollowing, setFollowedFile]);

  // Hide context menu when clicking elsewhere
  useEffect(() => {
    const hide = () => setMenuPos(null);
    window.addEventListener('click', hide);
    return () => window.removeEventListener('click', hide);
  }, []);

  return (
    <div className="select-none relative">
      <div 
        className={`flex items-center py-1 px-4 cursor-pointer text-[12px] transition-all duration-150 ${isSelected ? 'bg-indigo-50 text-indigo-700 font-bold border-r-2 border-indigo-500' : 'hover:bg-gray-50 text-gray-600'}`} 
        style={{ paddingLeft: `${(level * 12) + 16}px` }} 
        onClick={handleAction}
        onContextMenu={handleContextMenu}
      >
        <div className="w-4 mr-1 flex items-center justify-center">
          {entry.isFolder && (isOpen ? <ChevronDown size={14} className="text-indigo-500" /> : <ChevronRight size={14} className="text-gray-400" />)}
        </div>
        <div className="mr-2 flex items-center justify-center relative">
          {entry.isFolder ? (
            <Folder size={16} className={isOpen ? 'text-indigo-500' : 'text-gray-400'} />
          ) : isPdf ? (
            <File size={16} className={isSelected ? 'text-orange-500' : 'text-orange-400'} />
          ) : (
            <>
              <FileText size={16} className={isSelected ? 'text-indigo-500' : 'text-gray-300'} />
              {/* Follow indicator badge for followed files */}
              {isFollowing && (
                <div className="absolute -top-1 -right-1 bg-orange-500 rounded-full border border-white">
                  <Target size={8} className="text-white" />
                </div>
              )}
            </>
          )}
        </div>
        <span className="truncate flex-1 tracking-tight">{entry.name}</span>
      </div>

      {/* Context menu for follow/unfollow actions */}
      <AnimatePresence>
        {menuPos && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{ position: 'fixed', top: menuPos.y, left: menuPos.x, zIndex: 1000 }}
            className="bg-white border border-gray-100 rounded-xl p-1.5 min-w-[140px]"
          >
            <button 
              onClick={handleFollow}
              className="w-full flex items-center gap-2 px-3 py-2 hover:bg-orange-50 rounded-lg transition-colors group"
            >
              <Target size={14} className={isFollowing ? "text-red-500" : "text-orange-500"} />
              <span className="text-[11px] font-bold text-gray-600 group-hover:text-orange-700 tracking-tight">
                {isFollowing ? "Unfollow" : "Follow tasks"}
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

TreeItem.displayName = 'TreeItem';
