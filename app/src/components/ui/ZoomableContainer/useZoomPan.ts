
import { useState, useRef, useCallback } from "react";

export function useZoomPan(ref: React.RefObject<HTMLDivElement | null>) {
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const last = useRef({ x: 0, y: 0 });

  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault(); const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const nextS = Math.min(Math.max(scale * delta, 0.1), 10);
    if (ref.current) {
      const r = ref.current.getBoundingClientRect();
      const mx = e.clientX - r.left; const my = e.clientY - r.top;
      setPos({ x: mx - (mx - pos.x) * (nextS / scale), y: my - (my - pos.y) * (nextS / scale) });
      setScale(nextS);
    }
  }, [scale, pos, ref]);

  const onDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 2) { setIsPanning(true); last.current = { x: e.clientX, y: e.clientY }; e.preventDefault(); }
  }, []);

  const onMove = useCallback((e: React.MouseEvent) => {
    if (isPanning) {
      setPos(p => ({ x: p.x + (e.clientX - last.current.x), y: p.y + (e.clientY - last.current.y) }));
      last.current = { x: e.clientX, y: e.clientY };
    }
  }, [isPanning]);

  return { scale, pos, isPanning, onWheel, onDown, onMove, stop: () => setIsPanning(false) };
}
