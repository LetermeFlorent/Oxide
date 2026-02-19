import { useEffect } from "react";
import { yieldIfInputPending } from "../../../utils/scheduling";

const ITEM_HEIGHT = 24;
const INDENT_SIZE = 16;
const FONT_SIZE = 12;

export function useGPUDraw(canvasRef: any, visibleItems: any[], scrollTop: number, dimensions: any) {
  useEffect(() => {
    let active = true;
    const canvas = canvasRef.current;
    if (!canvas || visibleItems.length === 0) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const draw = async () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = dimensions.width * dpr; canvas.height = dimensions.height * dpr;
      ctx.scale(dpr, dpr); ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      for (let i = 0; i < visibleItems.length; i++) {
        if (!active) break;
        const { entry, level, index } = visibleItems[i];
        const y = (index * ITEM_HEIGHT) - scrollTop;
        if (y + ITEM_HEIGHT < 0 || y > dimensions.height) continue;
        if (i > 0 && i % 40 === 0) await yieldIfInputPending();

        const x = level * INDENT_SIZE + 10;
        ctx.fillStyle = entry.isFolder ? '#60a5fa' : '#94a3b8';
        ctx.beginPath(); ctx.arc(x + 5, y + ITEM_HEIGHT / 2, 3, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#334155'; ctx.font = `${FONT_SIZE}px Inter, sans-serif`;
        ctx.fillText(entry.name, x + 15, y + (ITEM_HEIGHT / 2) + (FONT_SIZE / 3));
      }
    };
    draw(); return () => { active = false; };
  }, [visibleItems, scrollTop, dimensions]);
}
