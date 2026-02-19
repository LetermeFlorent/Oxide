import { X, Settings2, Check } from "lucide-react";
import { motion } from "framer-motion";

export const EditOverviewModal = ({ show, onHide, projects, editingProjectIds, toggleProject, onConfirm }: any) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-black/20 backdrop-blur-md">
      <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="w-full max-w-sm bg-white border border-gray-200 rounded-3xl p-6 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center"><Settings2 size={16} className="text-black" /></div>
            <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-800">Configure Grid</h3>
          </div>
          <button onClick={onHide} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400"><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-modern-thin space-y-1 pr-1 mb-6">
          {projects.filter((p: any) => p && p.id && p.id.trim() !== "").map((p: any) => (
            <button key={p.id} onClick={() => toggleProject(p.id)} className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${editingProjectIds.includes(p.id) ? 'bg-gray-50 border border-gray-100' : 'hover:bg-gray-50 border border-transparent'}`}>
              <span className={`text-[11px] font-bold truncate ${editingProjectIds.includes(p.id) ? 'text-black' : 'text-gray-600'}`}>{p.name}</span>
              <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${editingProjectIds.includes(p.id) ? 'bg-black border-black text-white' : 'bg-white border-gray-200'}`}>
                {editingProjectIds.includes(p.id) && <Check size={12} strokeWidth={4} />}
              </div>
            </button>
          ))}
        </div>
        <button disabled={editingProjectIds.length === 0} onClick={onConfirm} className="w-full py-4 bg-black hover:bg-black disabled:opacity-30 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-gray-200 active:scale-95">Confirm Selection</button>
      </motion.div>
    </div>
  );
};
