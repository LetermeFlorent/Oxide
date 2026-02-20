import { useStore } from "./store/useStore";
import { useFileOperations } from "./hooks/useFileOperations";
import { ProjectTabs } from "./components/layout/ProjectTabs";
import { useAppInitialization } from "./hooks/useAppInitialization";
import { useFolderManagement } from "./hooks/useFolderManagement";
import { useFollowedFileSync } from "./hooks/useFollowedFileSync";
import { MainLayout } from "./components/layout/MainLayout";
import { useEffect, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import { ConfirmModal } from "./components/ui/ConfirmModal";
import { PromptModal } from "./components/ui/PromptModal";

export default function App() {
  const { appReady, hydrated } = useAppInitialization();
  const { openFolder } = useFolderManagement();
  const { onFile, onUndo } = useFileOperations();
  useFollowedFileSync();
  
  const confirmModal = useStore(s => s.confirmModal);
  const setConfirmModal = useStore(s => s.setConfirmModal);

  const promptModal = useStore(s => s.promptModal);
  const setPromptModal = useStore(s => s.setPromptModal);

  const state = useStore(useShallow(s => ({
    activeProjectId: s.activeProjectId,
    projects: s.projects,
    compactMode: s.compactMode,
    verticalTabs: s.verticalTabs
  })));

  const restoreRef = useRef("");

  useEffect(() => {
    const handleUndo = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) {
        const isInput = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName || '');
        const isMonaco = document.activeElement?.closest('.monaco-editor');
        if (!isInput && !isMonaco) {
          e.preventDefault();
          console.log("[App] Triggering Undo for deletion");
          onUndo();
        }
      }
    };
    window.addEventListener('keydown', handleUndo);
    return () => window.removeEventListener('keydown', handleUndo);
  }, [onUndo]);

  useEffect(() => {
    if (appReady && state.activeProjectId && restoreRef.current !== state.activeProjectId) {
      const proj = useStore.getState().projects.find(p => p.id === state.activeProjectId);
      if (proj?.selectedFile) { onFile(proj.selectedFile); }
      restoreRef.current = state.activeProjectId;
    }
  }, [appReady, state.activeProjectId, onFile]);

  if (!hydrated) return null;

  const hasTabs = useStore(s => s.projects.length > 0 || s.terminalOverviews.length > 0 || s.showSettings);
  const showTabs = !state.verticalTabs && hasTabs;

  return (
    <div className={`h-screen w-screen bg-[#f3f3f3] overflow-hidden flex flex-col transition-opacity duration-500 ${appReady ? 'opacity-100' : 'opacity-0'}`}>
      <div className="flex-1 flex flex-col overflow-hidden" style={{ padding: state.compactMode ? '0' : '8px', gap: state.compactMode ? '0' : '8px' }}>
        {showTabs && <ProjectTabs onOpen={() => openFolder('add')} />}
        <MainLayout onOpen={() => openFolder('add')} onOpenFolder={() => openFolder('replace')} onFile={onFile} />
      </div>
      <ConfirmModal 
        show={!!confirmModal?.show} 
        title={confirmModal?.title || ""} 
        message={confirmModal?.message || ""} 
        kind={confirmModal?.kind}
        onHide={() => setConfirmModal(null)} 
        onConfirm={confirmModal?.onConfirm || (() => {})} 
      />
      <PromptModal 
        show={!!promptModal?.show} 
        title={promptModal?.title || ""} 
        label={promptModal?.label || ""} 
        defaultValue={promptModal?.defaultValue || ""} 
        onHide={() => setPromptModal(null)} 
        onConfirm={(val) => {
          if (promptModal?.onConfirm) promptModal.onConfirm(val);
          setPromptModal(null);
        }} 
      />
    </div>
  );
}
