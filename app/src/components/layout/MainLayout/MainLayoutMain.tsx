
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
  const s = useStore(); useMemoryOptimization();
  const startExp = useResizable('--explorer-w');
  const startTerm = useResizable('--terminal-w');
  const activeProject = useStore(selectActiveProject);
  const isTerm = !!useStore(selectActiveOverview);

  return (
    <div className="flex-1 flex flex-row overflow-hidden min-h-0 relative z-0">
      {s.activeProjectId && <ProjectWatcher />}<ActivityBar onOpenFolder={onOpenFolder} />
      {!s.compactMode && <div className="w-2 shrink-0" />}
      {s.verticalTabs && (s.projects.length > 0 || s.terminalOverviews.length > 0) && (
        <><div className={`w-48 flex flex-col shrink-0 overflow-hidden ${s.compactMode ? 'border-r border-gray-200' : 'rounded-xl shadow-sm border border-gray-100 bg-white'}`}><ProjectTabs onOpen={onOpen} /></div>{!s.compactMode && <div className="w-2 shrink-0" />}</>
      )}
      {(s.showExplorer || s.showSearch) && s.activeProjectId && !isTerm && (
        <><div style={{ width: 'var(--explorer-w)' }} className={`bg-white flex flex-col shrink-0 overflow-hidden ${s.compactMode ? 'border-r border-gray-200' : 'rounded-xl shadow-sm border border-gray-100'}`}>
          {s.showSearch ? <SearchPanel onFileClick={onFile} /> : <Sidebar onFileClick={onFile} />}
        </div><DraggableHandle onMouseDown={startExp} /></>
      )}
      <div className="flex-1 flex flex-row overflow-hidden min-w-0">
        <WorkspaceView id={s.activeProjectId} project={activeProject} projects={s.projects} overviews={s.terminalOverviews} showPre={s.showPreview} isTerm={isTerm} isCompact={s.compactMode} startTerm={startTerm} onOpen={onOpen} />
      </div>
    </div>
  );
}
