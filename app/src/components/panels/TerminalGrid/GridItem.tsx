
import { Terminal } from "../Terminal";
import { X } from "lucide-react";
import { motion, useDragControls } from "framer-motion";
import { t } from "../../../i18n";

export const GridItem = ({ id, overviewId, compactMode, onRemove, onDrag, onDragStart, onDragEnd, containerRef, style }: any) => {
  const controls = useDragControls();

  return (
    <motion.div 
      layout drag dragControls={controls} dragListener={false}
      dragMomentum={false} dragSnapToOrigin={true} dragConstraints={containerRef}
      onDragStart={onDragStart} onDrag={(_, info) => onDrag(info)} onDragEnd={onDragEnd}
      whileDrag={{ zIndex: 100, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 500, damping: 35, mass: 0.5 }}
      style={style} className="z-10 group/item"
    >
      <div className={`flex-1 h-full w-full flex flex-col bg-white overflow-hidden relative shadow-sm border border-gray-100 ${compactMode ? '' : 'rounded-lg'}`}>
        <button onClick={() => onRemove(id)} className="absolute top-1 right-1 z-50 p-1 bg-white/80 backdrop-blur border border-gray-100 rounded-md text-gray-400 hover:text-red-500 hover:scale-110 opacity-0 group-hover/item:opacity-100 transition-all shadow-sm" title={t('overview.remove')}><X size={12} strokeWidth={3} /></button>
        <Terminal projectId={id} suffix={`-overview-${overviewId}`} onDragStart={(e) => controls.start(e)} />
      </div>
    </motion.div>
  );
};
