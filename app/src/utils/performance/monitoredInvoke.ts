
import { invoke } from "@tauri-apps/api/core";
import { perf } from "./perfMonitor";

export async function monitoredInvoke<T>(cmd: string, args?: any): Promise<T> {
  const start = performance.now();
  try {
    const res = await invoke<T>(cmd, args);
    const dur = performance.now() - start;
    const type = cmd.includes('scan') || cmd.includes('index') ? 'scan' : 'invoke';
    perf.log(type as any, cmd, dur);
    return res;
  } catch (err) {
    perf.log('invoke', `${cmd} (FAIL)`, performance.now() - start);
    throw err;
  }
}
