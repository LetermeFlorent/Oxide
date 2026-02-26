
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { memo } from "react";

export const ContextMenuContainer = memo(({ children, x, y, onHide }: any) => (
  <div className="fixed inset-0 z-[1000]" onClick={onHide} onContextMenu={(e) => { e.preventDefault(); onHide(); }}>
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      style={{ left: Math.min(x, window.innerWidth - 180), top: Math.min(y, window.innerHeight - 200) }} 
      className="absolute w-44 bg-white border border-gray-100 rounded-xl shadow-2xl p-1"
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </motion.div>
  </div>
));

export const ContextMenuItem = memo(({ onClick, icon: Icon, label, variant = 'default' }: { onClick: () => void, icon: LucideIcon, label: string, variant?: 'default' | 'danger' | 'primary' }) => {
  const styles = {
    default: "text-gray-600 hover:bg-gray-50",
    danger: "text-red-500 hover:bg-red-50",
    primary: "text-black hover:bg-gray-50"
  };
  return (
    <button className={`w-full text-left flex items-center gap-2 px-3 py-2 text-[10px] font-bold rounded-lg transition-colors ${styles[variant]}`} onClick={onClick}>
      <Icon size={12} /> {label}
    </button>
  );
});

export const ContextMenuSeparator = memo(() => <div className="h-px bg-gray-50 my-1" />);

ContextMenuContainer.displayName = 'ContextMenuContainer';
ContextMenuItem.displayName = 'ContextMenuItem';
ContextMenuSeparator.displayName = 'ContextMenuSeparator';
