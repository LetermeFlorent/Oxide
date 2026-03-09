import { motion } from "framer-motion";
import { memo } from "react";

export const ToggleItem = memo(({ icon: Icon, label, active, onClick }: any) => (
  <div 
    onClick={onClick}
    className="flex items-center justify-between p-3 bg-panel-bg border border-border rounded-xl cursor-pointer hover:bg-hover-bg transition-all group"
  >
    <div className="flex items-center gap-3 min-w-0">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${active ? 'bg-foreground text-background' : 'bg-sidebar-bg text-foreground/40'}`}>
        <Icon size={14} />
      </div>
      <span className="text-[10px] font-black uppercase tracking-tight text-foreground/60 truncate">{label}</span>
    </div>
    <div className={`w-8 h-4 rounded-full relative shrink-0 ${active ? 'bg-foreground' : 'bg-active-bg'}`}>
      <motion.div animate={{ x: active ? 18 : 2 }} transition={{ type: "spring", stiffness: 500, damping: 30 }} className="absolute top-1 w-2 h-2 bg-background rounded-full" />
    </div>
  </div>
));
