import { useState, useEffect } from "react";
import { useStore } from "../store/useStore";

export function useAppInitialization() {
  const [appReady, setAppReady] = useState(false);
  const hydrated = useStore(s => s.hydrated);

  useEffect(() => {
    if (hydrated) {
      const bar = document.getElementById('loader-bar');
      const pct = document.getElementById('loader-pct');
      const loader = document.getElementById('initial-loader');

      if (bar) bar.style.width = '100%';
      if (pct) pct.innerText = '100%';
      (window as any).bootProgress = 100;
      
      // Force immediate display
      setAppReady(true);

      if (loader) {
        loader.style.opacity = '0';
        loader.style.pointerEvents = 'none';
        setTimeout(() => loader.remove(), 400);
      }
    }
  }, [hydrated]);

  return { appReady, hydrated };
}
