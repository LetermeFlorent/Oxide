/**
 * @file App.tsx
 * @description Main application component and root layout
 * Orchestrates the entire IDE interface including sidebar, content viewer, and terminal
 * 
 * Features:
 * - Multi-project workspace management
 * - Hydration and loading state management
 * - Resizable panel layout (explorer, editor, terminal)
 * - Terminal overview grid support
 * - Compact and vertical tab modes
 * 
 * @component App
 */

import { open } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";
import { useStore } from "./store/useStore";
import { useResizable } from "./hooks/useResizable";
import { ActivityBar } from "./components/layout/ActivityBar";
import { Sidebar } from "./components/layout/Sidebar";
import { ContentViewer } from "./components/panels/ContentViewer";
import { Terminal } from "./components/panels/Terminal";
import { TerminalGrid } from "./components/panels/TerminalGrid";
import { DraggableHandle } from "./components/ui/DraggableHandle";
import { ProjectTabs } from "./components/layout/ProjectTabs";
import { WelcomeScreen } from "./components/layout/WelcomeScreen";
import { SettingsPanel } from "./components/panels/SettingsPanel";
import { AppLoader } from "./components/ui/AppLoader";
import { useFileOperations } from "./hooks/useFileOperations";
import { useCallback, useMemo, useEffect, useState } from "react";

/**
 * Main App Component
 * 
 * Root component that manages the entire application state and layout.
 * Handles persistence hydration, project loading, and renders the main IDE layout.
 * 
 * @returns {JSX.Element} The complete IDE interface
 */
export default function App() {
  // Global store state accessors
  const hydrated = useStore(s => s.hydrated);
  const setHydrated = useStore(s => s.setHydrated);
  const projects = useStore(s => s.projects) || [];
  const terminalOverviews = useStore(s => s.terminalOverviews) || [];

  // Local state for React loader
  const [appReady, setAppReady] = useState(false);
  
  /**
   * Effect: Remove initial HTML loader once React takes over
   * Ensures smooth transition from static HTML loader to React app
   */
  useEffect(() => {
    if (appReady) {
      console.log("[App] App is ready, removing initial loader.");
      const initialLoader = document.getElementById('initial-loader');
      if (initialLoader) {
        initialLoader.style.opacity = '0';
        initialLoader.style.transition = 'opacity 0.4s ease-out';
        setTimeout(() => {
          if (initialLoader.parentNode) {
            initialLoader.remove();
          }
        }, 400);
      }
    }
  }, [appReady]);

  /**
   * Memo: Check if any project is still loading its file tree
   * Used to determine when to hide the loading screen
   */
  const anyProjectLoading = useMemo(() => 
    projects.some(p => p.isLoading !== false && (!p.tree || p.tree.length === 0))
  , [projects]);

  /**
   * Effect: Loader lifecycle management
   * Delays showing the app until projects are loaded
   */
  useEffect(() => {
    if (hydrated) {
      if (!anyProjectLoading) {
        const timer = setTimeout(() => setAppReady(true), 800);
        return () => clearTimeout(timer);
      }
    }
  }, [hydrated, anyProjectLoading]);

  /**
   * Effect: Failsafe timer to force display if hydration takes too long
   * Prevents infinite loading state if something goes wrong
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!appReady) {
        console.warn("[App] Hydration/Scan timeout, forcing display.");
        if (!hydrated) setHydrated(true);
        setAppReady(true);
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, [hydrated, appReady, setHydrated]);

  // UI state from store
  const activeProjectId = useStore(s => s.activeProjectId);
  const compactMode = useStore(s => s.compactMode);
  const verticalTabs = useStore(s => s.verticalTabs);
  const showExplorer = useStore(s => s.showExplorer);
  
  /**
   * Memo: Find currently active terminal overview (if any)
   */
  const activeOverview = useMemo(() => 
    terminalOverviews.find(o => o.id === activeProjectId) || null
  , [terminalOverviews, activeProjectId]);
  
  /**
   * Memo: Find currently active project (if any)
   */
  const activeProject = useMemo(() => 
    projects.find(p => p.id === activeProjectId) || null
  , [projects, activeProjectId]);
  
  /**
   * Boolean: Check if current view is a terminal overview grid
   */
  const isTerminalOverview = !!(activeProjectId && activeOverview);
  
  // File operations hook for handling file clicks
  const { onFile } = useFileOperations();
  
  // Resizable panel handlers
  const startExp = useResizable('--explorer-w');
  const startTerm = useResizable('--terminal-w');

  /**
   * Effect: Auto-scan projects on startup
   * Scans project directories that don't have a file tree yet
   * Also restores previously selected files
   */
  useEffect(() => {
    if (hydrated && projects.length > 0) {
      projects.forEach(async (p) => {
        // Scan project if tree not loaded
        if (!p.tree || p.tree.length === 0 || !p.imageFiles || p.imageFiles.length === 0) {
          try {
            const res = await invoke<any>("scan_project", { path: p.id, recursive: false });
            useStore.getState().updateProjectTree(p.id, res.tree, res.images);
          } catch (err) {}
        }
        // Restore selected file if it exists but content is not loaded
        if (p.selectedFile && !p.fileContent && !p.fileUrl) {
          onFile(p.selectedFile);
        }
      });
    }
  }, [hydrated]);

  /**
   * Handle opening folder(s) from file dialog
   * 
   * @param {'add' | 'replace'} mode - Whether to add to existing projects or replace current
   */
  const handleOpenFolder = useCallback(async (mode: 'add' | 'replace' = 'add') => {
    try {
      // Open native file dialog for directory selection
      const selected = await open({ directory: true, multiple: true });
      if (!selected) return;
      
      const paths = Array.isArray(selected) ? selected : [selected];
      const itemsToBatch: any[] = [];

      // Process each selected path
      for (const s of paths) {
        const pathString = typeof s === 'string' ? s : (s as any).path;
        if (!pathString) continue;
        
        // Extract folder name from path
        const name = pathString.replace(/[\\/]+$/, '').split(/[\\/]/).pop() || pathString;
        
        // Handle replace mode for first path
        if (mode === 'replace' && pathString === (typeof paths[0] === 'string' ? paths[0] : (paths[0] as any).path)) {
          useStore.getState().replaceProject(pathString, name, []);
        } else {
          itemsToBatch.push({ path: pathString, name, tree: [] });
        }

        // Trigger async scan for this project
        setTimeout(async () => {
          try {
            const res = await invoke<any>("scan_project", { path: pathString, recursive: false });
            useStore.getState().updateProjectTree(pathString, res.tree, res.images);
          } catch (e) {}
        }, 0);
      }
      
      // Batch add remaining projects
      if (itemsToBatch.length > 0) useStore.getState().addProjects(itemsToBatch);
    } catch (err) {}
  }, []);

  return (
    // Main application container with background
    <div className="h-screen w-screen bg-[#f3f3f3] overflow-hidden flex flex-col">
      {/* Loading overlay - shown while app is initializing */}
      {!appReady && (
        <AppLoader 
          show={true} 
          message={!hydrated ? "Initializing..." : "Loading projects..."} 
        />
      )}
      
      {/* Main IDE interface - only shown after hydration */}
      {hydrated && (
        <div 
          className={`flex-1 flex flex-col overflow-hidden transition-opacity duration-500 ${appReady ? 'opacity-100' : 'opacity-0'}`}
          style={{ padding: compactMode ? '0' : '8px', gap: compactMode ? '0' : '8px' }}
        >
          {/* Settings modal panel */}
          <SettingsPanel />
          
          {/* Horizontal tabs (when not in vertical mode) */}
          {!verticalTabs && (projects.length > 0 || terminalOverviews.length > 0) && (
            <ProjectTabs onOpen={() => handleOpenFolder('add')} />
          )}
          
          {/* Main layout area */}
          <div className="flex-1 flex flex-row overflow-hidden min-h-0">
            {/* Left activity bar with icons */}
            <ActivityBar onOpenFolder={() => handleOpenFolder('replace')} />
            {!compactMode && <div className="w-2 shrink-0" />}

            {/* Vertical tabs sidebar (when in vertical mode) */}
            {verticalTabs && (projects.length > 0 || terminalOverviews.length > 0) && (
              <>
                <div className={`w-48 flex flex-col shrink-0 overflow-hidden ${compactMode ? 'border-r border-gray-200' : 'rounded-xl shadow-sm border border-gray-100 bg-white'}`}>
                  <div className="h-10 px-4 flex items-center border-b border-gray-100 text-[10px] font-black uppercase text-gray-400 tracking-tighter">Projects</div>
                  <ProjectTabs onOpen={() => handleOpenFolder('add')} />
                </div>
                {!compactMode && <div className="w-2 shrink-0" />}
              </>
            )}
            
            {/* File explorer sidebar */}
            {showExplorer && activeProjectId && !isTerminalOverview && activeProject && (
              <>
                <div style={{ width: 'var(--explorer-w)' }} className={`bg-white flex flex-col shrink-0 overflow-hidden ${compactMode ? 'border-r border-gray-200' : 'rounded-xl shadow-sm border border-gray-100'}`}>
                  <div className="h-10 px-4 flex items-center border-b border-gray-100 text-[10px] font-black uppercase text-gray-400 tracking-tighter">Explorer</div>
                  <Sidebar onFileClick={onFile} />
                </div>
                <DraggableHandle onMouseDown={startExp} />
              </>
            )}
            
            {/* Main content area */}
            <div className="flex-1 flex flex-row overflow-hidden min-w-0">
              {/* Show welcome screen when no project is open */}
              {!activeProjectId ? (
                <WelcomeScreen onOpen={() => handleOpenFolder('add')} />
              ) : isTerminalOverview ? (
                // Show terminal grid for overview mode
                <TerminalGrid overviewId={activeProjectId} />
              ) : (
                // Standard project view: Content viewer + Terminal
                <>
                  <ContentViewer 
                    content={activeProject?.fileContent || ''} 
                    fileName={activeProject?.selectedFile?.name} 
                    fileUrl={activeProject?.fileUrl} 
                  />
                  <DraggableHandle onMouseDown={startTerm} />
                  <div key={activeProjectId} style={{ width: 'var(--terminal-w)' }} className={`h-full shrink-0 min-w-0 flex ${compactMode ? 'border-l border-gray-200' : ''}`}>
                    <Terminal projectId={activeProjectId} />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
