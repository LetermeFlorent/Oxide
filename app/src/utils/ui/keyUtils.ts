
/**
 * Generates a stable unique key for React components.
 * Uses the ID and prefix to ensure identity is preserved across renders.
 */
export const safeKey = (prefix: string, id: string | number | null | undefined, index?: number): string => {
  const rawId = id ?? '';
  const base = String(rawId).trim() || `empty-${index ?? 'x'}`;
  
  // Stable key based on ID to prevent re-mounting and flickering
  return `${prefix}-${base}`;
};

export const isValidKey = (key: string): boolean => {
  return typeof key === 'string' && key.length > 0;
};
