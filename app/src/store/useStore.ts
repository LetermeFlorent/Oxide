
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WorkspaceState } from "./types";
import { stateCreator } from "./stateCreator";
import { storeStorage } from "./storeStorage";
import { migrateStore } from "./storeMigration";
import { partializeStore } from "./storePartialize";
import { STORAGE_KEY } from "./constants";

export const useStore = create<WorkspaceState>()(
  persist(stateCreator, {
    name: STORAGE_KEY,
    storage: storeStorage,
    version: 5,
    migrate: (ps, v) => migrateStore(ps, v) as WorkspaceState,
    partialize: (s) => partializeStore(s),
    onRehydrateStorage: () => (s) => s?.setHydrated(true)
  })
);
