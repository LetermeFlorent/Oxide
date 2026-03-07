import { useEffect, useState } from "react";
import { metrics, PerfMetric } from "../../utils/performance/perfMonitor";
import { useStore } from "../../store/useStore";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, X } from "lucide-react";

export const PerformanceOverlay = () => {
  const show = useStore(s => s.showPerformanceOverlay);
  const setSetting = useStore(s => s.setSetting);
  const [data, setData] = useState<PerfMetric[]>([]);

  useEffect(() => {
    if (!show) return;
    const update = () => setData([...metrics]);
    window.addEventListener('oxide-perf-update', update);
    update();
    return () => window.removeEventListener('oxide-perf-update', update);
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] bg-panel-bg border border-border rounded-2xl shadow-2xl p-4 w-[400px] max-h-[300px] overflow-hidden flex flex-col"
        >
          <div className="flex items-center justify-between mb-3 shrink-0">
            <div className="flex items-center gap-2 text-foreground/60">
              <Activity size={14} className="text-emerald-400" />
              <span className="text-[10px] font-black uppercase tracking-widest">System Performance</span>
            </div>
            <button onClick={() => setSetting('showPerformanceOverlay', false)} className="p-1 hover:bg-hover-bg rounded-lg text-foreground/40 transition-colors">
              <X size={14} />
            </button>
          </div>

          <div className="flex-1 overflow-auto scrollbar-modern-thin space-y-1 pr-2">
            {data.length === 0 ? (
              <div className="text-[10px] text-foreground/20 italic py-4 text-center">Waiting for telemetry...</div>
            ) : (
              data.map((m, i) => (
                <div key={i} className="flex items-center justify-between py-1 border-b border-border last:border-0 group">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      m.type === 'invoke' ? 'bg-blue-400' : 
                      m.type === 'scan' ? 'bg-purple-400' : 
                      m.type === 'render' ? 'bg-emerald-400' : 'bg-gray-400'
                    }`} />
                    <span className="text-[9px] font-mono text-foreground/80 truncate group-hover:text-foreground transition-colors" title={m.name}>{m.name}</span>
                  </div>

                  <span className={`text-[10px] font-black tabular-nums ${m.duration > 100 ? 'text-red-400' : m.duration > 50 ? 'text-yellow-400' : 'text-emerald-400'}`}>
                    {m.duration.toFixed(1)}ms
                  </span>
                </div>
              ))
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
