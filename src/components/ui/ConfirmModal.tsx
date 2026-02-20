import { AlertTriangle, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfirmModalProps {
  show: boolean;
  title: string;
  message: string;
  onHide: () => void;
  onConfirm: () => void;
  kind?: 'danger' | 'warning' | 'info';
  confirmLabel?: string;
  cancelLabel?: string;
}

export const ConfirmModal = ({ 
  show, 
  title, 
  message, 
  onHide, 
  onConfirm, 
  kind = 'danger',
  confirmLabel = "Confirm",
  cancelLabel = "Cancel"
}: ConfirmModalProps) => {
  if (!show) return null;

  const colorClass = kind === 'danger' ? 'bg-red-50 text-red-500' : 
                    kind === 'warning' ? 'bg-orange-50 text-orange-500' : 
                    'bg-blue-50 text-blue-500';
  
  const btnClass = kind === 'danger' ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' : 
                  kind === 'warning' ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20' : 
                  'bg-black hover:bg-gray-800 shadow-black/10';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[3000] flex items-center justify-center p-6 bg-black/10 backdrop-blur-md">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          exit={{ opacity: 0, scale: 0.95, y: 10 }} 
          className="w-full max-w-xs bg-white border border-gray-100 rounded-[2rem] shadow-2xl p-7"
        >
          <div className="flex flex-col items-center text-center">
            <div className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center mb-5 ${colorClass} transition-colors duration-500`}>
              {kind === 'danger' ? <Trash2 size={28} /> : <AlertTriangle size={28} />}
            </div>
            
            <h3 className="text-[16px] font-black text-gray-900 mb-2 tracking-tight">{title}</h3>
            <p className="text-[12px] font-bold text-gray-400 leading-relaxed mb-8 px-2">{message}</p>

            <div className="flex gap-2 w-full mt-2">
              <button 
                onClick={onHide} 
                className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] transition-all active:scale-95"
              >
                {cancelLabel}
              </button>
              <button 
                onClick={() => { onConfirm(); onHide(); }} 
                className={`flex-1 py-4 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.15em] transition-all active:scale-95 shadow-lg ${btnClass}`}
              >
                {confirmLabel}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
