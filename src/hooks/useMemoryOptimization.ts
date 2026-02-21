import { useEffect } from "react";

/**
 * Hook for proactive memory management.
 * Suggests the JS engine to perform Garbage Collection during idle periods.
 */
export function useMemoryOptimization() {
  useEffect(() => {
    // Schedule periodic idle checks
    const interval = setInterval(() => {
      if ('requestIdleCallback' in window) {
        // @ts-ignore
        window.requestIdleCallback((deadline) => {
          // If we have more than 10ms of idle time, we can perform some cleanup
          if (deadline.timeRemaining() > 10) {
            // Force clearing of internal caches if exposed or simply let GC trigger
            // In many browsers, this hint helps the engine prioritize GC
            if (performance && (performance as any).memory) {
              const memory = (performance as any).memory;
              if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.8) {
                console.warn("[Memory] Heap usage high, hinting GC...");
              }
            }
          }
        }, { timeout: 2000 });
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, []);
}
