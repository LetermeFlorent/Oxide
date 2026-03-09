
import { useStore } from "../../../store/useStore";
import { selectActiveProject, selectActiveOverview } from "../../../store/selectors";
import { useResizable, useMemoryOptimization } from "../../../hooks";
import { ActivityBar } from "../ActivityBar/index";
import { Sidebar } from "../Sidebar/index";
import { SearchPanel } from "../../panels/SearchPanel";
import { ProjectTabs } from "../ProjectTabs/index";
import { WorkspaceView } from "./WorkspaceView";
import { DraggableHandle, ProjectWatcher } from "../../ui";

export function MainLayout({ onOpen, onOpenFolder, onFile }: any) {
  const activeProjectId = useStore(s => s.activeProjectId);
  const verticalTabs = useStore(s => s.verticalTabs);
  const showExplorer = useStore(s => s.showExplorer);
  const showSearch = useStore(s => s.showSearch);
  const showPreview = useStore(s => s.showPreview);
  const terminalOverviews = useStore(s => s.terminalOverviews);
  const projects = useStore(s => s.projects);
  const groups = useStore(s => s.groups);

  const showSettings = useStore(s => s.showSettings);

  useMemoryOptimization();
  const startExp = useResizable('--explorer-w');
  const startTerm = useResizable('--terminal-w');
  const activeProject = useStore(selectActiveProject);
  const isTerm = !!useStore(selectActiveOverview);

  return (
    <div className="flex-1 flex flex-row overflow-hidden min-h-0 relative z-0 px-3 pb-1 pt-0">
      {activeProjectId && <ProjectWatcher />}
      <div className="flex flex-row gap-2 h-full">
        <ActivityBar onOpenFolder={onOpenFolder} />
        
        {verticalTabs && (projects.length > 0 || groups.length > 0 || terminalOverviews.length > 0 || !!showSettings) && (
          <div className="w-56 flex flex-col shrink-0 overflow-hidden rounded-xl shadow-sm bg-panel-bg border border-border/40"><ProjectTabs onOpen={onOpen} /></div>
        )}
      </div>
      
      <div className="w-2 shrink-0" />

      {(showExplorer || showSearch) && activeProjectId && !isTerm && (
        <><div style={{ width: 'var(--explorer-w)' }} className="bg-panel-bg flex flex-col shrink-0 overflow-hidden rounded-[12px] shadow-sm">
          {showSearch ? <SearchPanel onFileClick={onFile} /> : <Sidebar onFileClick={onFile} />}
        </div><DraggableHandle onMouseDown={startExp} /></>
      )}
      
      <div className="flex-1 flex flex-row overflow-hidden min-w-0">
        <WorkspaceView id={activeProjectId} project={activeProject} projects={projects} overviews={terminalOverviews} showPre={showPreview} isTerm={isTerm} startTerm={startTerm} onOpen={onOpen} />
      </div>
    </div>
  );
}
