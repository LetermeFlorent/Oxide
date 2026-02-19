/**
 * @file scheduling.ts
 * @description Low-latency scheduling utilities to prioritize user input.
 */

/**
 * Yields control back to the browser if there's pending user input.
 * Ensures the main thread stays responsive even during heavy UI work.
 */
export async function yieldIfInputPending() {
  // @ts-ignore - Experimental API check
  if (navigator.scheduling?.isInputPending?.()) {
    await new Promise(resolve => setTimeout(resolve, 0));
    return true;
  }
  
  // Also yield periodically via scheduler API if available
  // @ts-ignore
  if (window.scheduler?.yield) {
    // @ts-ignore
    await window.scheduler.yield();
  }
  
  return false;
}

/**
 * Executes a task with low priority, yielding to input between chunks.
 */
export async function chunkedTask<T>(
  items: T[], 
  process: (item: T) => void, 
  chunkSize: number = 50
) {
  for (let i = 0; i < items.length; i++) {
    process(items[i]);
    if (i > 0 && i % chunkSize === 0) {
      await yieldIfInputPending();
    }
  }
}
