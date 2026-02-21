import { memo } from "react";
import { motion } from "framer-motion";

export const Tab = memo(({ active, onClick, icon: Icon, label }: any) => (
  <motion.button 
    whileHover={{ y: -1 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick} 
    className={`flex items-center gap-1.5 text-[9px] font-black tracking-widest transition-all duration-200 px-2 py-1 rounded-md ${active ? 'text-black bg-gray-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50/50'}`}
  >
    <Icon size={12} className={active ? 'text-black' : 'text-gray-300'} /> 
    <span>{label}</span>
    {active && <motion.div layoutId="tab-active" className="absolute bottom-0 left-2 right-2 h-0.5 bg-black rounded-full" />}
  </motion.button>
));

Tab.displayName = 'Tab';
