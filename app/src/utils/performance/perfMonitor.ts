
export const perf = {
  log: (type: 'invoke' | 'scan' | 'render' | 'store' | 'fs', name: string, duration: number, budget?: number) => {
    // Performance monitoring logs disabled
  }
};

export const perfMonitor = (name: string, type: string, duration: number, budget?: number) => {
  // Performance monitoring logs disabled
};
