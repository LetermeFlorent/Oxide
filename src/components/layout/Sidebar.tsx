/**
 * @file Sidebar.tsx
 * @description File explorer sidebar with project tree, search, and image gallery
 * Displays the active project's file structure with virtualized rendering for performance
 * 
 * Features:
 * - Virtualized tree rendering for large projects
 * - Global multi-threaded search across projects
 * - Lazy-loaded image thumbnails with blob URLs
 * - Collapsible image gallery section
 * - Real-time project indexing status
 * 
 * @component Sidebar
 * @example
 * <Sidebar onFileClick={handleFileOpen} />
 */

import { useStore } from "../../store/useStore";
import { TreeItem } from "../panels/Explorer";
import { memo, useMemo, useState, useEffect, useCallback, useRef } from "react";
import { ImageIcon, ChevronDown, ChevronRight, Loader2, Search, FileText } from "lucide-react";
import { readFile } from "@tauri-apps/plugin-fs";
import { invoke } from "@tauri-apps/api/core";
import { flattenTree } from "../../utils/treeUtils";

// Height of each tree item in pixels - used for virtualized scrolling calculations
const ITEM_HEIGHT = 28;

/**
 * ImageThumbnail Component
 * 
 * Lazy-loaded image thumbnail with loading state and blob URL generation.
 * Reads image binary data and creates a temporary blob URL for preview.
 * Automatically cleans up blob URLs on unmount to prevent memory leaks.
 * 
 * @param {Object} props - Component props
 * @param {string} props.path - Absolute file path to the image
 * @returns {JSX.Element} The thumbnail preview with loading state
 */
const ImageThumbnail = memo(({ path }: { path: string }) => {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const bytes = await readFile(path);
        if (!active) return;
        const ext = path.split('.').pop()?.toLowerCase() || 'png';
        const blob = new Blob([bytes], { type: `image/${ext === 'svg' ? 'svg+xml' : ext}` });
        setBlobUrl(URL.createObjectURL(blob));
      } catch (e) {} finally { if (active) setLoading(false); }
    };
    load();
    return () => { active = false; if (blobUrl) URL.revokeObjectURL(blobUrl); };
  }, [path]);

  return (
    <div className="w-8 h-8 rounded border border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
      {loading ? <Loader2 size={10} className="text-indigo-300 animate-spin" /> : blobUrl ? <img src={blobUrl} alt="" className="w-full h-full object-cover" /> : <ImageIcon size={10} className="text-gray-300" />}
    </div>
  );
});

/**
 * Sidebar Component
 * 
 * Main file explorer sidebar that displays the active project's contents.
 * Combines file tree navigation, global search, and image gallery in one panel.
 * 
 * Features:
 * - Virtualized tree rendering for projects with thousands of files
 * - Native multi-threaded search across all open projects
 * - Lazy-loaded image thumbnails with performance limits (max 50 displayed)
 * - Collapsible sections and responsive design
 * 
 * @param {Object} props - Component props
 * @param {(f: any) => void} props.onFileClick - Callback when a file is clicked
 * @returns {JSX.Element} The file explorer sidebar interface
 */
export const Sidebar = memo(({ onFileClick }: { onFileClick: (f: any) => void }) => {
  const activeProjectId = useStore(s => s.activeProjectId);
  const projects = useStore(s => s.projects) || [];
  const activeProject = projects.find(p => p.id === activeProjectId);
  const expandedFolders = useStore(s => s.expandedFolders);
  
  const [showImages, setShowImages] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Observe container size changes for virtualized list calculations
  useEffect(() => {
    if (!scrollRef.current) return;
    const observer = new ResizeObserver(entries => {
      setContainerHeight(entries[0].contentRect.height);
    });
    observer.observe(scrollRef.current);
    return () => observer.disconnect();
  }, []);

  const onScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  /**
   * Native multi-threaded search across all open projects
   * Uses Rust backend for high-performance text search
   * Debounced at 300ms to avoid excessive searches while typing
   */
  useEffect(() => {
    if (searchQuery.length < 2) { setSearchResults([]); return; }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const paths = projects.map(p => p.id);
        const results = await invoke<any[]>("search_in_projects", { paths, query: searchQuery });
        setSearchResults(results);
      } catch (e) {} finally { setIsSearching(false); }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, projects.length]);

  // Flatten tree structure for virtualized rendering
  const flatTree = useMemo(() => {
    if (!activeProject || !activeProject.tree || searchQuery.trim()) return [];
    return flattenTree(activeProject.tree, expandedFolders);
  }, [activeProject, expandedFolders, searchQuery]);

  // Calculate visible items for virtualization with overscan (5 items above/below)
  const visibleItems = useMemo(() => {
    if (searchQuery.trim() || activeProject?.isLoading) return [];
    const start = Math.max(0, Math.floor(scrollTop / ITEM_HEIGHT) - 5);
    const end = Math.min(flatTree.length, Math.ceil((scrollTop + containerHeight) / ITEM_HEIGHT) + 5);
    return flatTree.slice(start, end).map((item, i) => ({ ...item, index: start + i }));
  }, [flatTree, scrollTop, containerHeight, searchQuery, activeProject?.isLoading]);

  // Limit displayed images to 50 for performance
  const displayImages = useMemo(() => {
    return (activeProject?.imageFiles || []).slice(0, 50);
  }, [activeProject?.imageFiles]);

  if (!activeProject) return null;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
      <div className="px-4 py-2 flex items-center justify-between text-indigo-600 bg-indigo-50/30 border-b border-indigo-100/50">
        <span className="text-[10px] font-black uppercase tracking-[0.15em] truncate flex-1">{activeProject.name}</span>
      </div>

      <div className="px-3 py-2 border-b border-gray-100">
        <div className="relative">
          <Search size={12} className={`absolute left-2.5 top-1/2 -translate-y-1/2 ${searchQuery ? 'text-indigo-500' : 'text-gray-400'}`} />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Global search..." className="w-full pl-8 pr-8 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-[11px] font-bold text-gray-700 outline-none focus:border-indigo-500/50 transition-all" />
          {isSearching && <Loader2 size={10} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-indigo-400" />}
        </div>
      </div>

      <div ref={scrollRef} onScroll={onScroll} className="flex-1 overflow-auto scrollbar-modern relative">
        {searchQuery.length >= 2 ? (
          <div className="p-2 space-y-1">
            {searchResults.map((res, i) => (
              <div key={i} onClick={() => onFileClick({ name: res.path.split('/').pop(), path: res.path, isFolder: false })} className="p-2 hover:bg-indigo-50 rounded-xl cursor-pointer group border border-transparent hover:border-indigo-100 transition-all">
                <div className="flex items-center gap-2 mb-1"><FileText size={10} className="text-indigo-400" /><span className="text-[10px] font-bold text-gray-700 truncate">{res.path.split('/').pop()}</span></div>
                <p className="text-[9px] text-gray-400 font-mono truncate bg-gray-50 p-1 rounded">{res.content}</p>
              </div>
            ))}
          </div>
        ) : activeProject.isLoading ? (
          <div className="p-8 text-center flex flex-col items-center gap-4 animate-pulse">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100/50"><Loader2 size={24} className="text-indigo-500 animate-spin" /></div>
            <p className="text-[11px] font-black uppercase text-indigo-600">Indexing...</p>
          </div>
        ) : (
          <div style={{ height: flatTree.length * ITEM_HEIGHT, width: '100%', position: 'relative' }}>
            {visibleItems.map(({ entry, level, index }) => (
              <div key={entry.path} style={{ position: 'absolute', top: index * ITEM_HEIGHT, height: ITEM_HEIGHT, width: '100%' }}><TreeItem entry={entry} onClick={onFileClick} level={level} /></div>
            ))}
          </div>
        )}
      </div>

      {/* Image Gallery Section with performance limit */}
      {!searchQuery && activeProject.imageFiles && activeProject.imageFiles.length > 0 && (
        <div className="border-t border-gray-100 bg-white/50 backdrop-blur-sm shrink-0 max-h-[45%] flex flex-col">
          <button onClick={() => setShowImages(!showImages)} className="w-full px-4 py-2 flex items-center justify-between hover:bg-gray-100/50 transition-colors">
            <div className="flex items-center gap-2">
              <ImageIcon size={14} className="text-orange-500" />
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Images ({activeProject.imageFiles.length})</span>
            </div>
            {showImages ? <ChevronDown size={12} className="text-gray-400" /> : <ChevronRight size={12} className="text-gray-400" />}
          </button>
          {showImages && (
            <div className="flex-1 overflow-y-auto pb-2 scrollbar-modern-thin">
              <div className="px-2 space-y-0.5">
                {displayImages.map(img => (
                  <div key={img.path} onClick={() => onFileClick(img)} className="flex items-center gap-2 p-1 hover:bg-orange-50 rounded-lg cursor-pointer group transition-all">
                    <ImageThumbnail path={img.path} />
                    <span className="text-[10px] font-bold text-gray-600 truncate flex-1 group-hover:text-orange-700">{img.name}</span>
                  </div>
                ))}
                {activeProject.imageFiles.length > 50 && (
                  <p className="text-[8px] text-center text-gray-400 py-2 uppercase font-black opacity-50 tracking-tighter">+ {activeProject.imageFiles.length - 50} more images in folders</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

Sidebar.displayName = 'Sidebar';
