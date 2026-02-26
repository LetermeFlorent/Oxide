
import { GeminiIndicator } from "./GeminiIndicator";
import { X } from "lucide-react";
import { motion } from "framer-motion";

export const TerminalPathInfo = ({ p, onRemove, isHovered }: any) => (
  <div className="flex items-center gap-3 max-w-[45%] shrink-0">
    <div className="flex items-center gap-2 overflow-hidden">
      {p.isGeminiActive && <GeminiIndicator active={true} />}
      <div className={`flex flex-col items-end min-w-0 transition-all duration-300 ${isHovered && onRemove ? 'opacity-40 blur-[1px] -translate-x-2' : 'opacity-100'}`}>
        <span className="text-[7px] font-black uppercase text-gray-400 tracking-tighter truncate opacity-60">Path:</span>
        <span className="text-[9px] font-mono text-gray-500 truncate" title={p.id}>{p.id}</span>
      </div>
    </div>
    {onRemove && (
      <motion.button initial={false} animate={{ width: isHovered ? 'auto' : 0, opacity: isHovered ? 1 : 0, marginLeft: isHovered ? 8 : 0 }} onClick={(e) => { e.stopPropagation(); onRemove(); }} className="flex items-center justify-center p-1 bg-white border border-gray-100 rounded-md text-gray-400 hover:text-red-500 shadow-sm overflow-hidden shrink-0"><X size={12} strokeWidth={3} /></motion.button>
    )}
  </div>
);
