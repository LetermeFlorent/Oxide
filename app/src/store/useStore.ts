import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WorkspaceState } from "./config/types";
import { stateCreator } from "./stateCreator";
import { storeStorage } from "./config/storeStorage";
import { migrateStore } from "./config/storeMigration";
import { partializeStore } from "./config/storePartialize";
import { STORAGE_KEY } from "./config/constants";

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
