import { motion } from "framer-motion";
import { memo } from "react";

export const ToggleItem = memo(({ icon: Icon, label, active, onClick }: any) => (
  <div 
    onClick={onClick}
    className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl cursor-pointer hover:bg-gray-50 transition-all group"
  >
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${active ? 'bg-black text-white' : 'bg-gray-50 text-gray-400'}`}>
        <Icon size={14} />
      </div>
      <span className="text-[10px] font-black uppercase tracking-tight text-gray-600">{label}</span>
    </div>
    <div className={`w-8 h-4 rounded-full relative ${active ? 'bg-black' : 'bg-gray-200'}`}>
      <motion.div animate={{ x: active ? 18 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} className="absolute top-1 w-2 h-2 bg-white rounded-full" />
    </div>
  </div>
));
