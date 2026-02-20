import { Edit3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface PromptModalProps {
  show: boolean;
  title: string;
  label: string;
  defaultValue: string;
  onHide: () => void;
  onConfirm: (val: string) => void;
}

export const PromptModal = ({ show, title, label, defaultValue, onHide, onConfirm }: PromptModalProps) => {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    if (show) setValue(defaultValue);
  }, [show, defaultValue]);

  if (!show) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[4000] flex items-center justify-center p-6 bg-black/10 backdrop-blur-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          exit={{ opacity: 0, scale: 0.95, y: 10 }} 
          className="w-full max-w-xs bg-white border border-gray-100 rounded-[2rem] shadow-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-gray-50 text-gray-500">
              <Edit3 size={20} />
            </div>
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-0.5">{title}</h3>
              <p className="text-[13px] font-bold text-gray-800 leading-none">{label}</p>
            </div>
          </div>

          <input 
            autoFocus 
            type="text" 
            value={value} 
            onChange={(e) => setValue(e.target.value)} 
            onFocus={(e) => e.target.select()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && value.trim()) onConfirm(value.trim());
              if (e.key === 'Escape') onHide();
            }} 
            className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-[12px] font-bold text-gray-700 outline-none focus:border-black/20 focus:bg-white transition-all mb-5" 
          />

          <div className="flex gap-2">
            <button 
              onClick={onHide} 
              className="flex-1 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
            >
              Cancel
            </button>
            <button 
              disabled={!value.trim()}
              onClick={() => value.trim() && onConfirm(value.trim())} 
              className="flex-1 py-3.5 bg-black hover:bg-gray-800 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-black/10 disabled:opacity-30 disabled:pointer-events-none"
            >
              OK
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
