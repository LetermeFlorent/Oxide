import { X, Trash2, Folder, Terminal, Check, CheckSquare, Square } from "lucide-react";
import { motion } from "framer-motion";

export const CloseTabsModal = ({ show, onHide, allTabs, selectedIds, onToggle, onSelectAll, onConfirm }: any) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/20 backdrop-blur-md p-4" onClick={onHide}>
      <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-white border border-gray-200 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh]" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center"><Trash2 size={20} className="text-red-500" /></div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-gray-800">Tab Management</h3>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Close multiple items at once</p>
            </div>
          </div>
          <button onClick={onHide} className="p-2 hover:bg-gray-200 rounded-xl transition-colors text-gray-400"><X size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-modern-thin">
          <button onClick={onSelectAll} className="w-full flex items-center justify-between p-3 hover:bg-gray-50/50 rounded-2xl transition-all group border border-dashed border-gray-100 mb-4 text-[11px] font-black uppercase text-black">
            <span>Select All</span>
            {selectedIds.length === allTabs.length ? <CheckSquare size={18} className="text-black" /> : <Square size={18} className="text-gray-200 group-hover:text-gray-400" />}
          </button>
          {allTabs.filter((t: any) => t && t.id && t.id.trim() !== "").map((tab: any) => (
            <div key={tab.id} onClick={() => onToggle(tab.id)} className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${selectedIds.includes(tab.id) ? 'bg-gray-50 border border-gray-100' : 'hover:bg-gray-50 border border-transparent'}`}>
              <div className="flex items-center gap-3 min-w-0">
                {tab.type === 'overview' ? <Terminal size={14} className="text-gray-600 shrink-0" /> : <Folder size={14} className="text-gray-400 shrink-0" />}
                <span className={`text-[11px] font-bold truncate ${selectedIds.includes(tab.id) ? 'text-black' : 'text-gray-600'}`}>{tab.name}</span>
              </div>
              {selectedIds.includes(tab.id) ? <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center shadow-lg shadow-gray-200"><Check size={12} className="text-white" strokeWidth={4} /></div> : <div className="w-5 h-5 rounded-full border-2 border-gray-200 group-hover:border-gray-300" />}
            </div>
          ))}
        </div>
        <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex gap-3">
          <button onClick={onHide} className="flex-1 py-3 bg-white border border-gray-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500">Cancel</button>
          <button disabled={selectedIds.length === 0} onClick={onConfirm} className="flex-[2] py-3 bg-red-500 hover:bg-red-600 disabled:opacity-30 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"><Trash2 size={14} /> Close {selectedIds.length} tabs</button>
        </div>
      </motion.div>
    </div>
  );
};
