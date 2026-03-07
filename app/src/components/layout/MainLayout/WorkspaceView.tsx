
import { memo } from "react";
import { WelcomeScreen } from "../WelcomeScreen";
import { ContentViewer } from "../../panels/ContentViewer";
import { DraggableHandle } from "../../ui/DraggableHandle";
import { ProjectPanels } from "./ProjectPanels";

export const WorkspaceView = memo(({ id, project, projects, overviews, showPre, isTerm, isCompact, startTerm, onOpen }: any) => {
  if (!id) return <WelcomeScreen onOpen={onOpen} />;

  return (
    <div className="flex-1 flex flex-row overflow-hidden relative">
      {showPre && !isTerm && <><ContentViewer content={project?.fileContent || ''} fileName={project?.selectedFile?.name} fileUrl={project?.fileUrl} /><DraggableHandle onMouseDown={startTerm} /></>}
      <div style={{ width: (showPre && !isTerm) ? 'var(--terminal-w)' : '100%' }} className={`h-full shrink-0 min-w-0 flex relative ${isCompact && showPre && !isTerm ? 'border-l border-border' : ''}`}>
        <ProjectPanels projects={projects} overviews={overviews} activeId={id} />
      </div>
    </div>
  );
});

WorkspaceView.displayName = 'WorkspaceView';
