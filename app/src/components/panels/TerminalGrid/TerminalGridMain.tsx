
import { useStore } from "../../../store/useStore";
import { makeSelectOverviewById } from "../../../store/selectors";
import { memo, useMemo, useRef, useEffect } from "react";
import { useGridActions, GridEmptyState, GridHeader } from "../TerminalGrid/index";
import { useGridDrag } from "./hooks/useGridDrag";
import { GridItem } from "./GridItem";

export const TerminalGrid = memo(({ overviewId }: { overviewId: string }) => {
  const compactMode = useStore(s => s.compactMode);
  const overview = useStore(useMemo(() => makeSelectOverviewById(overviewId), [overviewId]));
  const setProjects = useStore(s => s.setTerminalOverviewProjects);
  const containerRef = useRef<HTMLDivElement>(null);
  const pIds = useMemo(() => (overview?.projectIds || []).filter(id => id?.trim()), [overview]);
  const n = pIds.length;
  if (!n) return <GridEmptyState compactMode={compactMode} />;
  const cols = n <= 1 ? 1 : (n <= 4 ? 2 : 3);
  const rows = Math.ceil(n / cols);
  const { masterCmd, setMasterCmd, handleBroadcast, handleRemove } = useGridActions(overviewId, pIds);
  const { localOrder, setLocalOrder, handleDrag, onDragStart, onDragEnd } = useGridDrag(pIds, setProjects, overviewId, containerRef, cols, rows);
  useEffect(() => { setLocalOrder(pIds); }, [pIds, setLocalOrder]);

  return (
    <div className={`flex-1 flex flex-col min-h-0 bg-panel-bg overflow-hidden ${compactMode ? '' : 'rounded-xl border border-border shadow-sm'}`}>
      <GridHeader name={overview?.name || ""} count={n} cmd={masterCmd} setCmd={setMasterCmd} onBroadcast={handleBroadcast} />
      <div ref={containerRef} className={`flex-1 relative min-h-0 bg-sidebar-bg/30 ${compactMode ? 'p-0' : 'p-2'}`}>
        {localOrder.map((id, index) => (
          <GridItem key={id} id={id} overviewId={overviewId} compactMode={compactMode} onRemove={handleRemove} onDragStart={() => onDragStart(id)} onDrag={(info: any) => handleDrag(id, info)} onDragEnd={onDragEnd} containerRef={containerRef} style={{ position: 'absolute', top: `${(Math.floor(index / cols) / rows) * 100}%`, left: `${((index % cols) / cols) * 100}%`, width: `${100 / cols}%`, height: `${100 / rows}%`, padding: compactMode ? '0' : '4px' }} />
        ))}
      </div>
    </div>
  );
});
TerminalGrid.displayName = 'TerminalGrid';
