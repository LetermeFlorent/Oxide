
import { memo } from "react";
import { Terminal } from "../../panels/Terminal";
import { TerminalGrid } from "../../panels/TerminalGrid";
import { safeKey } from "../../../utils/ui/keyUtils";

export const ProjectPanels = memo(({ projects, overviews, activeId }: any) => (
  <>
    {projects.map((p: any, idx: number) => (
      <div key={safeKey('pj-panel', p.id, idx)} className={`flex-1 flex flex-col min-w-0 ${activeId === p.id ? '' : 'hidden'}`}>
        <Terminal projectId={p.id} />
      </div>
    ))}
    {overviews.map((ov: any, idx: number) => (
      <div key={safeKey('ov-panel', ov.id, idx)} className={`flex-1 flex flex-col min-w-0 ${activeId === ov.id ? '' : 'hidden'}`}>
        <TerminalGrid overviewId={ov.id} />
      </div>
    ))}
  </>
));

ProjectPanels.displayName = 'ProjectPanels';
