
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
      <div className={`flex-1 h-full w-full flex flex-col bg-panel-bg overflow-hidden relative shadow-sm border border-border ${compactMode ? '' : 'rounded-lg'}`}>
        <Terminal projectId={id} onRemove={() => onRemove(id)} onDragStart={(e) => controls.start(e)} />
      </div>
    </motion.div>
  );
};
