
import { useStore } from "./store/useStore";
import { useFileOperations } from "./hooks/useFileOperations";
import { ProjectTabs } from "./components/layout/ProjectTabs";
import { useAppInitialization } from "./hooks/useAppInitialization";
import { useFolderManagement } from "./hooks/useFolderManagement";
import { useFollowedFileSync } from "./hooks/useFollowedFileSync";
import { MainLayout } from "./components/layout/MainLayout";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { useAppStateSync } from "./hooks/useAppStateSync";
import { GlobalModals } from "./components/ui/GlobalModals";
import { useEffect } from "react";

export default function App() {
  const { appReady, hydrated } = useAppInitialization();
  const { openFolder } = useFolderManagement();
  const { onFile, onUndo } = useFileOperations();
  const { activeProjectId, compactMode, verticalTabs, projects, showSettings, switchProject, setViewMode } = useStore();
  
  useEffect(() => {
    if (hydrated) {
      const params = new URLSearchParams(window.location.search);
      const pId = params.get('projectId');
      const vMode = params.get('viewMode');
      const sId = params.get('sessionId');
      
      if (pId) {
        const state = useStore.getState();
        // Si c'est une nouvelle session sans projets, on tente de restaurer l'onglet cible
        if (state.projects.length === 0 && state.terminalOverviews.length === 0) {
          const pName = params.get('projectName') || 'Project';
          
          try {
            const raw = localStorage.getItem('oxide-workspace-storage-v4');
            const mainState = raw ? JSON.parse(raw)?.state : null;
            
            if (mainState) {
              const project = (mainState.projects || []).find((x: any) => x.id === pId);
              const overview = (mainState.terminalOverviews || []).find((x: any) => x.id === pId);
              
              if (project) {
                state.replaceProject(project.id, project.name, project.tree);
                // Restore complete project state
                state.updateProject(project.id, { ...project });
              } else if (overview) {
                const linkedProjects = (mainState.projects || []).filter((p: any) => 
                  overview.projectIds.includes(p.id)
                );
                state.setProjects(linkedProjects);
                state.setTerminalOverviews([overview]);
              } else if (pId.startsWith('/')) {
                // Ultimate fallback: attempt to re-scan if it's a valid path
                state.replaceProject(pId, pName, []);
              }
            } else if (pId.startsWith('/')) {
              // If no mainState exists (rare), force project creation
              state.replaceProject(pId, pName, []);
            }
          } catch (e) {
            if (pId.startsWith('/')) state.replaceProject(pId, pName, []);
          }
        }
        
        // Force activation after state restoration
        setTimeout(() => switchProject(pId), 50);
      }
      if (vMode) setViewMode(vMode as any);
    }
  }, [hydrated, switchProject, setViewMode]);

  useFollowedFileSync();
  useKeyboardShortcuts(onUndo);
  useAppStateSync(appReady, activeProjectId, onFile);

  if (!hydrated) return null;
  const isDetached = new URLSearchParams(window.location.search).has('projectId');
  const showTabs = !verticalTabs && (projects.length > 0 || !!showSettings);

  return (
    <div className={`h-screen w-screen bg-[#f3f3f3] overflow-hidden flex flex-col select-none transition-opacity duration-500 ${appReady ? 'opacity-100' : 'opacity-0'}`}>
      <div className="flex-1 flex flex-col" style={{ padding: compactMode ? '0' : '8px', gap: compactMode ? '0' : '8px' }}>
        {showTabs && <ProjectTabs onOpen={() => openFolder('add')} />}
        <MainLayout onOpen={() => openFolder('add')} onOpenFolder={() => openFolder('replace')} onFile={onFile} />
      </div>
      <GlobalModals />
    </div>
  );
}
