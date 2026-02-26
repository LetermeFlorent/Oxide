
import { useEffect, memo, useMemo, useRef } from "react";
import { useStore } from "../../store/useStore";
import { useWatcherActions, useWatcherEvents } from "./ProjectWatcher/index";
import { safeKey } from "../../utils/ui/keyUtils";

const Watcher = memo(({ id }: { id: string }) => {
  const { refresh } = useWatcherActions(id);
  const initialized = useRef(false);
  
  useWatcherEvents(id, refresh);
  
  useEffect(() => {
    const p = useStore.getState().projects.find(px => px.id === id);
    const isEmpty = !p || !p.tree || p.tree.length === 0;
    if (isEmpty && !initialized.current) {
      initialized.current = true;
      refresh();
    }
  }, [id, refresh]);

  return null;
});

export const ProjectWatcher = memo(() => {
  const activeProjectId = useStore(s => s.activeProjectId);
  const terminalOverviews = useStore(s => s.terminalOverviews);
  const activeOverview = terminalOverviews.find(o => o.id === activeProjectId);
  const idsToWatch = useMemo(() => {
    const base = activeOverview ? [...activeOverview.projectIds] : (activeProjectId ? [activeProjectId] : []);
    return Array.from(new Set(base.filter(id => id && typeof id === 'string' && id.trim() !== "" && id !== 'settings')));
  }, [activeProjectId, activeOverview]);
  return <>{idsToWatch.map((id, idx) => <Watcher key={safeKey('watch', id, idx)} id={id} />)}</>;
});
