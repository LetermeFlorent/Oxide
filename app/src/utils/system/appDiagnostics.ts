
/**
 * Global application diagnostics and system health reporting.
 */
export const logDiagnostic = (tag: string, msg: string, data?: any) => {
  // @ts-ignore
  if (import.meta.env?.DEV) {
    console.log(`[DIAG][${tag}] ${msg}`, data || '');
  }
};

export const reportError = (error: Error, context: string) => {
  console.error(`[CRITICAL ERROR][${context}]:`, error);
};
