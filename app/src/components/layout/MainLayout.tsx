/**
 * @file MainLayout.tsx
 */

import { useStore } from "../../store/useStore";
import { selectActiveProject, selectActiveOverview } from "../../store/selectors";
import { useResizable } from "../../hooks/useResizable";
import { useMemoryOptimization } from "../../hooks/useMemoryOptimization";
import { ActivityBar } from "./ActivityBar";
import { Sidebar } from "./Sidebar";
import { ContentViewer } from "../panels/ContentViewer";
import { TerminalGrid } from "../panels/TerminalGrid";
import { DraggableHandle } from "../ui/DraggableHandle";
import { ProjectTabs } from "./ProjectTabs";
import { WelcomeScreen } from "./WelcomeScreen";
import { ProjectWatcher } from "../ui/ProjectWatcher";
import { BashTerminal } from "../panels/Terminal/BashTerminal";
import { SettingsPanel } from "../panels/SettingsPanel";

export function MainLayout({ onOpen, onOpenFolder, onFile }: any) {
  const activeProjectId = useStore(s => s.activeProjectId);
  const projects = useStore(s => s.projects);
  const terminalOverviews = useStore(s => s.terminalOverviews);
  const compactMode = useStore(s => s.compactMode);
  const verticalTabs = useStore(s => s.verticalTabs);
  const showExplorer = useStore(s => s.showExplorer);
  const showPreview = useStore(s => s.showPreview);
  
  const showSettings = useStore(s => s.showSettings);
  
  const activeOverview = useStore(selectActiveOverview);
  const activeProject = useStore(selectActiveProject);
  const isTerminalOverview = !!activeOverview;
  const isSettings = activeProjectId === 'settings';
  
  const startExp = useResizable('--explorer-w');
  const startTerm = useResizable('--terminal-w');

  useMemoryOptimization();

  return (
    <div className="flex-1 flex flex-row overflow-hidden min-h-0">
      <ProjectWatcher />
      <ActivityBar onOpenFolder={onOpenFolder} />
      {!compactMode && <div className="w-2 shrink-0" />}
      {verticalTabs && (projects.length > 0 || terminalOverviews.length > 0 || showSettings) && (
        <><div className={`w-48 flex flex-col shrink-0 overflow-hidden ${compactMode ? 'border-r border-gray-200' : 'rounded-xl shadow-sm border border-gray-100 bg-white'}`}><ProjectTabs onOpen={onOpen} /></div>{!compactMode && <div className="w-2 shrink-0" />}</>
      )}
      {showExplorer && activeProjectId && !isTerminalOverview && !isSettings && (
        <><div style={{ width: 'var(--explorer-w)' }} className={`bg-white flex flex-col shrink-0 overflow-hidden ${compactMode ? 'border-r border-gray-200' : 'rounded-xl shadow-sm border border-gray-100'}`}><Sidebar onFileClick={onFile} /></div><DraggableHandle onMouseDown={startExp} /></>
      )}
      <div className="flex-1 flex flex-row overflow-hidden min-w-0">
        {!activeProjectId ? <WelcomeScreen onOpen={onOpen} /> : activeProjectId === 'settings' ? <SettingsPanel /> : (
          <div className="flex-1 flex flex-row overflow-hidden relative">
            {showPreview && !isTerminalOverview && <ContentViewer content={activeProject?.fileContent || ''} fileName={activeProject?.selectedFile?.name} fileUrl={activeProject?.fileUrl} />}
            {showPreview && !isTerminalOverview && <DraggableHandle onMouseDown={startTerm} />}
            <div style={{ width: (showPreview && !isTerminalOverview) ? 'var(--terminal-w)' : '100%' }} className={`h-full shrink-0 min-w-0 flex relative ${compactMode && showPreview && !isTerminalOverview ? 'border-l border-gray-200' : ''}`}>
              {/* Individual project terminals */}
              {projects.filter(p => p.id).map(p => (
                <div 
                  key={p.id} 
                  className={`flex-1 flex flex-col min-w-0 ${activeProjectId === p.id && !isTerminalOverview ? '' : 'hidden'}`}
                >
                  <BashTerminal projectId={p.id} />
                </div>
              ))}
              
              {/* Terminal Overview grids */}
              {terminalOverviews.filter(ov => ov.id).map(ov => (
                <div 
                  key={ov.id} 
                  className={`flex-1 flex flex-col min-w-0 ${activeProjectId === ov.id ? '' : 'hidden'}`}
                >
                  <TerminalGrid overviewId={ov.id} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
