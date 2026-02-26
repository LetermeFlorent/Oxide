
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
  id, icon: Icon, onClick, active = false, activeColor = "text-black" 
}: IconButtonProps) => (
  <motion.button 
    whileHover={{ scale: 1.1, y: -2 }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick} 
    className={`p-2 mb-2 relative flex items-center justify-center rounded-lg transition-all duration-200 ${
      active ? `${activeColor} bg-gray-50/50` : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50/30'
    }`}
  >
    <Icon size={20} className="relative z-10" />
    <AnimatePresence>
      {active && (
        <motion.div 
          layoutId={`active-bar-${id}`}
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -5 }}
          className="absolute left-0 w-0.5 h-4 bg-current rounded-full" 
        />
      )}
    </AnimatePresence>
  </motion.button>
));

IconButton.displayName = 'IconButton';
