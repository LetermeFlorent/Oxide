
import { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface IconButtonProps {
  id: string;
  icon: any;
  onClick: () => void;
  active?: boolean;
  activeColor?: string;
}

export const IconButton = memo(({ 
  id, icon: Icon, onClick, active = false, activeColor = "text-foreground" 
}: IconButtonProps) => (
  <motion.button 
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick} 
    className={`w-10 h-10 mb-2 relative flex items-center justify-center rounded-[12px] transition-all duration-300 ${
      active ? `bg-active-bg ${activeColor} shadow-sm` : 'text-foreground/40 hover:text-foreground hover:bg-hover-bg'
    }`}
  >
    <Icon size={20} strokeWidth={active ? 2.5 : 2} className="relative z-10" />
  </motion.button>
));

IconButton.displayName = 'IconButton';
