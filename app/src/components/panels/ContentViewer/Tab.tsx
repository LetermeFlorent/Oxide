import { memo } from "react";
import { motion } from "framer-motion";

export const Tab = memo(({ active, onClick, icon: Icon, label }: any) => (
  <motion.div 
    layout
    onClick={onClick} 
    className={`group relative flex items-center gap-2 px-3 h-8 transition-all cursor-pointer shrink-0 overflow-hidden select-none ${
      active 
        ? 'bg-panel-bg border border-border shadow-sm rounded-lg text-foreground font-bold' 
        : 'bg-transparent text-foreground/40 hover:bg-panel-bg/40 rounded-lg'
    }`}
  >
    <Icon size={12} className={active ? 'text-foreground' : 'text-gray-300'} /> 
    <span className="text-[9px] font-black uppercase tracking-tight">{label}</span>
    {active && <motion.div layoutId="content-tab-active" className="absolute bottom-0 left-2 right-2 h-0.5 bg-black rounded-full" />}
  </motion.div>
));

Tab.displayName = 'Tab';
