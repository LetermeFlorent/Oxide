import { useEffect } from 'react';

export function useMemoryMonitor() {
  useEffect(() => {
    const interval = setInterval(() => {
      // @ts-ignore
      if (performance.memory) {
        // @ts-ignore
        const { usedJSHeapSize, jsHeapSizeLimit } = performance.memory;
        const usedMB = usedJSHeapSize / 1024 / 1024;
        
        // Only log if it's significant or every few minutes
        if (usedMB > 1000) {
          console.warn(`[RAM] Usage: ${usedMB.toFixed(1)} MB / 1000MB Threshold`);
        }
        
        if (usedMB > 3000) {
          console.error(
            `%c [RAM CRITICAL 🚨] Usage: ${usedMB.toFixed(1)} MB / 3000 MB LIMIT! `,
            'background: red; color: white; font-size: 20px; font-weight: bold; padding: 10px;'
          );
        }
      }
    }, 10000); // 10 seconds instead of 2 seconds
    return () => clearInterval(interval);
  }, []);
}
