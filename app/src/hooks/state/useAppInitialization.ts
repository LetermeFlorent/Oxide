import { useState, useEffect } from "react";
import { useStore } from "../../store/useStore";

export function useAppInitialization() {
  const [appReady, setAppReady] = useState(false);
  const hydrated = useStore(s => s.hydrated);

  useEffect(() => {
    // 1. FAST TRACK: If already hydrated or after 1s, start showing things
    const fastTrack = setTimeout(() => {
      if (!appReady) setAppReady(true);
    }, 1000);

    // 2. EMERGENCY: If still stuck after 3s, remove loader no matter what
    const emergency = setTimeout(() => {
      const loader = document.getElementById('initial-loader');
      if (loader) {
        loader.style.opacity = '0';
        loader.style.pointerEvents = 'none';
        setTimeout(() => loader.remove(), 400);
      }
    }, 3000);

    if (hydrated) {
      clearTimeout(fastTrack);
      setAppReady(true);
      const loader = document.getElementById('initial-loader');
      if (loader) {
        const bar = document.getElementById('loader-bar');
        const pct = document.getElementById('loader-pct');
        if (bar) bar.style.width = '100%';
        if (pct) pct.innerText = '100%';
        loader.style.opacity = '0';
        loader.style.pointerEvents = 'none';
        setTimeout(() => loader.remove(), 400);
      }
    }

    return () => { clearTimeout(fastTrack); clearTimeout(emergency); };
  }, [hydrated, appReady]);

  return { appReady, hydrated };
}
