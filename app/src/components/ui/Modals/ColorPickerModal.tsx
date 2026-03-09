
import { memo } from "react";
import { Palette, X, Check } from "lucide-react";
import { useStore } from "../../../store/useStore";
import { motion, AnimatePresence } from "framer-motion";

const COLORS = [
  { name: 'Default', value: '' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Green', value: '#10b981' },
  { name: 'Orange', value: '#f59e0b' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Indigo', value: '#6366f1' },
];

export const ColorPickerModal = memo(() => {
  const modal = useStore(s => s.colorModal);
  const hide = () => useStore.getState().setColorModal(null);
  const updateProject = useStore(s => s.updateProject);
  const projects = useStore(s => s.projects);
  
  if (!modal || !modal.show) return null;
  
  const project = projects.find(p => p.id === modal.projectId);
  const currentColor = project?.color || '';

  const handleSelect = (color: string) => {
    updateProject(modal.projectId, { color });
    hide();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 bg-black/50" onClick={hide}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-xs bg-panel-bg border border-border rounded-[12px] shadow-2xl p-6"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-foreground/60">
              <Palette size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">Terminal Color</span>
            </div>
            <button onClick={hide} className="p-1 hover:bg-hover-bg rounded-lg text-foreground/40 transition-colors">
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {COLORS.map((c) => (
              <button
                key={c.name}
                onClick={() => handleSelect(c.value)}
                className="group flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-hover-bg transition-all"
              >
                <div 
                  className="w-10 h-10 rounded-full border-2 border-border flex items-center justify-center relative overflow-hidden"
                  style={{ backgroundColor: c.value || 'transparent' }}
                >
                  {!c.value && <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-red-500/20 to-transparent rotate-45" />}
                  {currentColor === c.value && (
                    <div className="bg-white/30 backdrop-blur-sm rounded-full p-1 shadow-sm">
                      <Check size={14} className="text-white drop-shadow-md" strokeWidth={4} />
                    </div>
                  )}
                </div>
                <span className="text-[8px] font-black uppercase tracking-tighter text-foreground/40">{c.name}</span>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
});

ColorPickerModal.displayName = 'ColorPickerModal';
