
/**
 * Utility to yield control back to the browser if user input is pending.
 * Helps prevent the main thread from blocking during heavy computations.
 */
export async function yieldIfInputPending(): Promise<void> {
  // @ts-ignore
  if (navigator.scheduling && navigator.scheduling.isInputPending()) {
    await new Promise(resolve => setTimeout(resolve, 0));
  }
}

/**
 * Simple delay utility.
 */
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
