/**
 * @file treeWorkerInstance.ts
 * @description Shared Web Worker instance for tree operations.
 */

export const treeWorker = new Worker(new URL('./treeWorker.ts', import.meta.url), { type: 'module' });
