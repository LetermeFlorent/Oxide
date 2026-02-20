import { Library } from "lucide-react";
import { motion } from "framer-motion";

export const GroupModal = ({ show, onHide, newGroupName, setNewGroupName, onConfirm }: any) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-black/20 backdrop-blur-md">
      <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="w-full max-w-xs bg-white border border-gray-200 rounded-3xl shadow-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center"><Library size={16} className="text-black" /></div>
          <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-800">New Group</h3>
        </div>
        <input autoFocus type="text" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && onConfirm()} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-[11px] font-bold text-gray-700 outline-none focus:border-black/50 transition-colors mb-4" />
        <div className="flex gap-2">
          <button onClick={onHide} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-[9px] font-black uppercase transition-all">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-3 bg-black hover:bg-black text-white rounded-xl text-[9px] font-black uppercase transition-all shadow-lg shadow-black/20">Create</button>
        </div>
      </motion.div>
    </div>
  );
};
