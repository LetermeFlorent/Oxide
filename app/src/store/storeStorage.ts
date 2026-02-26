
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
      // Pour les sessions détachées, on ne sauvegarde peut-être pas en BDD Rust
      // ou alors avec une clé différente. Pour l'instant, on garde le localStorage.
      if (!sId) invoke("save_workspace", { stateJson: v }).catch(() => {});
      localStorage.setItem(key, v);
    }, 100);
  },
}));
