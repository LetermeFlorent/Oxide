import { useEffect } from "react";
import { useStore } from "./store/useStore";
import { useFileOperations } from "./hooks/file/useFileOperations";
import { useAppInitialization } from "./hooks/state/useAppInitialization";
import { useFollowedFileSync } from "./hooks/file/useFollowedFileSync";
import { useKeyboardShortcuts } from "./hooks/ui/useKeyboardShortcuts";
import { useAppStateSync } from "./hooks/state/useAppStateSync";
import { useSessionRestoration } from "./hooks/state/useSessionRestoration";
import { useSyncFileProgress } from "./hooks/file/useSyncFileProgress";
import { useMemoryMonitor } from "./hooks/useMemoryMonitor";
import { useThemeDetection } from "./hooks/ui/useThemeDetection";
import { MainContainer } from "./components/layout/MainContainer";

export default function App() {
  const { appReady, hydrated } = useAppInitialization();
  const { onFile, onUndo } = useFileOperations();
  const activeProjectId = useStore(s => s.activeProjectId);

  useThemeDetection();

  // EMERGENCY SAFETY PURGE: If RAM was exploding or suspicious data exists, clear everything
  useEffect(() => {
    if (hydrated) {
      const state = useStore.getState();
      const mem = (performance as any).memory;
      const usedMB = mem ? mem.usedJSHeapSize / 1024 / 1024 : 0;
      
      if (!activeProjectId && usedMB > 800) {
        console.warn("RAM Caution: High memory usage on Welcome screen. ✨");
      }
    }
  }, [hydrated, activeProjectId]);

  useMemoryMonitor();
  useSessionRestoration(hydrated);
  useFollowedFileSync();
  useKeyboardShortcuts(onUndo);
  useAppStateSync(appReady, activeProjectId, onFile);
  useSyncFileProgress();

  if (!hydrated && !appReady) return null;

  return <MainContainer appReady={appReady} onFile={onFile} />;
}
