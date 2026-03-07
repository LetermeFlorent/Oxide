
export interface PerfMetric {
  type: 'invoke' | 'scan' | 'render' | 'store' | 'fs';
  name: string;
  duration: number;
  timestamp: number;
}

const MAX_METRICS = 50;
export const metrics: PerfMetric[] = [];

export const perf = {
  log: (type: 'invoke' | 'scan' | 'render' | 'store' | 'fs', name: string, duration: number) => {
    metrics.unshift({ type, name, duration, timestamp: Date.now() });
    if (metrics.length > MAX_METRICS) metrics.pop();
    
    // Custom event to notify overlay
    window.dispatchEvent(new CustomEvent('oxide-perf-update'));
  }
};

export const perfMonitor = (name: string, type: string, duration: number) => {
  perf.log(type as any, name, duration);
};
