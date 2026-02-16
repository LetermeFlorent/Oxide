import { useCallback, useRef } from 'react';

/**
 * @file useResizable.ts
 * @description Hook for creating resizable panels using CSS custom properties
 * Enables smooth drag-to-resize functionality with RAF optimization
 * 
 * Features:
 * - Smooth resize with requestAnimationFrame throttling
 * - Horizontal and vertical resize support
 * - CSS custom property binding for dynamic sizing
 * - Boundary constraints (5% - 95%)
 * 
 * @example
 * const startResize = useResizable('--sidebar-width');
 * <div onMouseDown={startResize} />
 * 
 * @param varName - CSS custom property name to update (e.g., '--sidebar-width')
 * @param vertical - Whether to resize vertically (default: horizontal)
 * @returns Mouse event handler to attach to resize handle
 */
export const useResizable = (varName: string, vertical = false) => {
  const frameRef = useRef<number>(0);

  return useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const root = document.documentElement;
    const style = getComputedStyle(root);
    const startVal = parseFloat(style.getPropertyValue(varName));
    const startPos = vertical ? e.clientY : e.clientX;

    const onMove = (me: MouseEvent) => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      
      frameRef.current = requestAnimationFrame(() => {
        const currentPos = vertical ? me.clientY : me.clientX;
        const deltaPx = currentPos - startPos;
        const deltaPercent = (deltaPx / (vertical ? window.innerHeight : window.innerWidth)) * 100;
        
        let newVal = varName === '--terminal-w' ? startVal - deltaPercent : startVal + deltaPercent;
        root.style.setProperty(varName, `${Math.max(5, Math.min(95, newVal))}%`);
      });
    };

    const onUp = () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      document.body.classList.remove('resizing-active', 'resizing-active-v');
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };

    document.body.classList.add(vertical ? 'resizing-active-v' : 'resizing-active');
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }, [varName, vertical]);
};
