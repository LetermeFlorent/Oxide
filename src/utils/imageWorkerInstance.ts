/**
 * @file imageWorkerInstance.ts
 * @description Shared Image Worker instance for thumbnails.
 */

export const imageWorker = new Worker(new URL('./imageWorker.ts', import.meta.url), { type: 'module' });
