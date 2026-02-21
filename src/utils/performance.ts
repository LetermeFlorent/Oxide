/**
 * @file performance.ts
 * @description Internal telemetry system for tracking performance budgets.
 * Monitors execution time for Tauri invokes and React renders.
 */

const BUDGETS = {
  render: 16, // 60fps target
  invoke: 100, // UX responsiveness target
  scan: 500,   // Heavy background task target
};

interface LogEntry {
  name: string;
  duration: number;
  type: 'render' | 'invoke' | 'scan';
  timestamp: number;
}

class PerformanceMonitor {
  private logs: LogEntry[] = [];
  private maxLogs = 100;

  log(type: 'render' | 'invoke' | 'scan', name: string, duration: number) {
    const entry: LogEntry = {
      name,
      duration,
      type,
      timestamp: Date.now()
    };

    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) this.logs.shift();

    const budget = BUDGETS[type];
    if (duration > budget) {
      console.warn(
        `%c[PERF] %c${type.toUpperCase()} %c${name} %cexceeded budget: %c${duration.toFixed(2)}ms %c(Budget: ${budget}ms)`,
        'color: #ff9800; font-weight: bold',
        'color: #2196f3',
        'color: #9c27b0',
        'color: #757575',
        'color: #f44336; font-weight: bold',
        'color: #757575'
      );
    }
  }

  getLogs() {
    return this.logs;
  }
}

export const perf = new PerformanceMonitor();

/**
 * Higher-order function to measure Tauri invoke performance
 */
export async function monitoredInvoke<T>(command: string, args?: any): Promise<T> {
  const start = performance.now();
  try {
    const { invoke } = await import("@tauri-apps/api/core");
    const result = await invoke<T>(command, args);
    const duration = performance.now() - start;
    
    const type = command.includes('scan') || command.includes('index') ? 'scan' : 'invoke';
    perf.log(type, command, duration);
    
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    perf.log('invoke', `${command} (FAILED)`, duration);
    throw error;
  }
}
