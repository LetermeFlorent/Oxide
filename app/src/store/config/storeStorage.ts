
import { createJSONStorage } from 'zustand/middleware';
import { invoke } from "@tauri-apps/api/core";

export const storeStorage = createJSONStorage(() => ({
  getItem: (n: string) => {
    const sId = new URLSearchParams(window.location.search).get('sessionId');
    const key = sId ? `${n}-${sId}` : n;
    return localStorage.getItem(key);
  },
  removeItem: (n: string) => {
    const sId = new URLSearchParams(window.location.search).get('sessionId');
    const key = sId ? `${n}-${sId}` : n;
    localStorage.removeItem(key);
  },
  setItem: (n: string, v: string) => {
    const sId = new URLSearchParams(window.location.search).get('sessionId');
    const key = sId ? `${n}-${sId}` : n;
    
    if ((window as any)._st) clearTimeout((window as any)._st);
    (window as any)._st = setTimeout(() => {
      try {
        // For detached sessions, we might not save to the Rust backend database,
        // or we might use a different key. For now, we stick with localStorage.
        if (!sId && typeof (window as any).__TAURI_INTERNALS__ !== 'undefined') {
          invoke("save_workspace", { stateJson: v }).catch(() => {});
        }
        localStorage.setItem(key, v);
      } catch (e) {
        console.error("[STORAGE] Save failed:", e);
      }
    }, 500);
  },
}));
