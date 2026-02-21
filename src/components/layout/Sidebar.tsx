import { memo, useMemo, useState, useEffect, useCallback } from "react";
import { RefreshCcw } from "lucide-react";
import { useStore } from "../../store/useStore";
import { GPUExplorer } from "../panels/GPUExplorer";
import { SidebarSearch } from "./Sidebar/SidebarSearch";
import { ImageGallery } from "./Sidebar/ImageGallery";
import { TreeItem } from "../panels/Explorer";
import { ITEM_HEIGHT, useSidebarWorker } from "./Sidebar/useSidebarWorker";
import { t } from "../../i18n";
import { monitoredInvoke } from "../../utils/performance";
import { FileContextMenu } from "../panels/Explorer/FileContextMenu";

import { revealItemInDir } from "@tauri-apps/plugin-opener";

import { ExplorerModal } from "../panels/Explorer/ExplorerModal";

export const Sidebar = memo(({ onFileClick }: { onFileClick: (f: any) => void }) => {
  const projects = useStore(s => s.projects);
  const activeProjectId = useStore(s => s.activeProjectId);
  const activeProject = useMemo(() => 
    projects.find(p => p.id === activeProjectId) || projects[0]
  , [projects, activeProjectId]);

  const updateProjectTree = useStore(s => s.updateProjectTree);
  const [searchQuery, setSearchQuery] = useState("");
  const [isIndexing, setIsIndexing] = useState(false);
  const expandedFolders = useStore(s => s.expandedFolders);
  const isLarge = useMemo(() => (activeProject?.tree?.length || 0) > 50000, [activeProject]);

  const { scrollRef, setScrollTop, setContainerHeight, expandedCount, visibleItems } = useSidebarWorker(activeProject, expandedFolders, searchQuery);

  const [bgMenu, setBgMenu] = useState<{ x: number, y: number } | null>(null);
  const explorerModal = useStore(s => s.explorerModal);
  const setExplorerModal = useStore(s => s.setExplorerModal);
  const applyFilePatch = useStore(s => s.applyFilePatch);
  const setFolderExpanded = useStore(s => s.setFolderExpanded);

  const handleBgContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (activeProject) setBgMenu({ x: e.clientX, y: e.clientY });
  }, [activeProject]);

  const handleExplorerConfirm = useCallback(async (name: string) => {
    if (!explorerModal || !activeProject) return;
    const { type, target } = explorerModal;
    
    // If target is null, it's a root creation from bg context menu
    // If target is folder, create inside it. If target is file, create next to it.
    let parentDir = activeProject.id;
    if (target) {
      parentDir = target.isFolder ? target.path : target.path.substring(0, Math.max(0, target.path.lastIndexOf('/')));
      if (!parentDir && target.path.includes('/')) parentDir = target.path.substring(0, target.path.lastIndexOf('/'));
    }
    
    const fullPath = `${parentDir}/${name}`.replace(/\/+/g, '/');
    console.log("[Sidebar] Creating", type, "at:", fullPath, "parent:", parentDir);
    
    try {
      if (type === 'file') {
        await monitoredInvoke("write_text_file", { path: fullPath, content: "" });
      } else {
        await monitoredInvoke("create_dir", { path: fullPath });
      }
      
      console.log("[Sidebar] Created on disk, patching UI...");
      applyFilePatch(activeProject.id, {
        parent_path: parentDir,
        removed: [],
        added: [{ 
          name, 
          path: fullPath, 
          isFolder: type === 'folder', 
          children: type === 'folder' ? [] : null 
        }]
      });
      
      if (parentDir) setFolderExpanded(parentDir, true);
      setExplorerModal(null);
    } catch (err) {
      console.error(`Create ${type} failed:`, err);
      alert(`Create ${type} failed: ` + err);
    }
  }, [explorerModal, activeProject, applyFilePatch, setFolderExpanded, setExplorerModal]);

  const onCreateFileRoot = useCallback(() => setExplorerModal({ show: true, type: 'file', target: null }), [setExplorerModal]);
  const onCreateFolderRoot = useCallback(() => setExplorerModal({ show: true, type: 'folder', target: null }), [setExplorerModal]);

  useEffect(() => {
    if (!scrollRef.current) return;
    const observer = new ResizeObserver((entries) => {
      if (entries[0]) setContainerHeight(entries[0].contentRect.height);
    });
    observer.observe(scrollRef.current);
    return () => observer.disconnect();
  }, [scrollRef, setContainerHeight]);

  const handleReindex = useCallback(async () => {
    if (!activeProject || isIndexing) return;
    setIsIndexing(true);
    try {
      const res = await monitoredInvoke<any>("scan_project", { path: activeProject.id, recursive: true });
      updateProjectTree(activeProject.id, res.tree);
      await monitoredInvoke("index_project_lsm", { path: activeProject.id });
    } catch (e) {
      console.error("[Sidebar] Reindex error:", e);
    } finally {
      setIsIndexing(false);
    }
  }, [activeProject, isIndexing, updateProjectTree]);

  if (isLarge && activeProject) return (
    <div className="flex-1 flex flex-col h-full bg-white">
      <div className="px-4 py-2 flex items-center justify-between border-b border-gray-100 bg-gray-50/30">
        <span className="font-black text-[10px] uppercase tracking-widest truncate mr-2" title={activeProject.name}>{activeProject.name} ({t('sidebar.gpu_mode')})</span>
        <button 
          onClick={handleReindex}
          disabled={isIndexing}
          className={`p-1 hover:bg-gray-200/50 rounded-md transition-all active:scale-95 ${isIndexing ? 'animate-spin opacity-50' : 'text-gray-400 hover:text-black'}`}
          title="Reindex Folder"
        >
          <RefreshCcw size={12} strokeWidth={3} />
        </button>
      </div>
      <GPUExplorer onFileClick={onFileClick} />
    </div>
  );

  if (!activeProject) return null;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-white">
      <div className="px-4 py-2 flex items-center justify-between bg-gray-50/30 border-b border-gray-100/50 overflow-hidden">
        <span className="font-black text-[10px] uppercase truncate mr-2 flex-1" title={activeProject.name}>{activeProject.name}</span>
        <button 
          onClick={handleReindex}
          disabled={isIndexing}
          className={`p-1 shrink-0 hover:bg-gray-200/50 rounded-md transition-all active:scale-95 ${isIndexing ? 'animate-spin opacity-50' : 'text-gray-400 hover:text-black'}`}
          title="Reindex Folder"
        >
          <RefreshCcw size={12} strokeWidth={3} />
        </button>
      </div>
      <SidebarSearch query={searchQuery} onChange={setSearchQuery} />
      <div 
        ref={scrollRef} 
        onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)} 
        onContextMenu={handleBgContextMenu}
        className="flex-1 overflow-auto relative scrollbar-modern min-h-0"
      >
        <div style={{ height: expandedCount * ITEM_HEIGHT, width: '100%', position: 'relative' }}>
          {visibleItems.length === 0 && !activeProject.isLoading && searchQuery.trim() === "" && (
             <div className="p-4 text-center text-[10px] text-gray-400 italic font-medium">Empty project</div>
          )}
          {visibleItems.map(({ entry, level, index }) => (
            <div key={`${activeProject.id}-${entry.path}-${index}`} style={{ position: 'absolute', top: index * ITEM_HEIGHT, height: ITEM_HEIGHT, width: '100%' }}>
              <TreeItem entry={entry} onClick={onFileClick} level={level} />
            </div>
          ))}
        </div>
      </div>
      {bgMenu && (
        <FileContextMenu 
          menu={{ ...bgMenu, entry: { name: activeProject.name, path: activeProject.id, isFolder: true } }} 
          onHide={() => setBgMenu(null)} 
          onRename={null} 
          onDelete={null} 
          onReveal={() => revealItemInDir(activeProject.id)}
          onCreateFile={onCreateFileRoot}
          onCreateFolder={onCreateFolderRoot}
        />
      )}
      <ExplorerModal 
        show={!!explorerModal?.show} 
        type={explorerModal?.type || 'file'} 
        onHide={() => { setExplorerModal(null); setBgMenu(null); }} 
        onConfirm={handleExplorerConfirm}
        title={!explorerModal?.target ? (explorerModal?.type === 'file' ? "New Root File" : "New Root Folder") : undefined}
      />
      <ImageGallery images={activeProject.imageFiles} onFileClick={onFileClick} />
    </div>
  );
});
