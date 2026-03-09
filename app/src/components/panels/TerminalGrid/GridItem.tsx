
import { useState, useMemo } from "react";
import { Terminal } from "../Terminal";
import { X } from "lucide-react";
import { motion, useDragControls } from "framer-motion";
import { t } from "../../../i18n";
import { useStore } from "../../../store/useStore";

export const GridItem = ({ id, overviewId, onRemove, onDrag, onDragStart, onDragEnd, containerRef, style }: any) => {
  const controls = useDragControls();
  const [isMoving, setIsMoving] = useState(false);
  const project = useStore(useMemo(() => (s: any) => s.projects.find((p: any) => p.id === id), [id]));
  const accentColor = project?.color;

  return (
    <motion.div 
      layout drag dragControls={controls} dragListener={false}
      dragMomentum={false} dragSnapToOrigin={true} dragConstraints={containerRef}
      onDragStart={() => { setIsMoving(true); onDragStart(); }} 
      onDrag={(_, info) => onDrag(info)} 
      onDragEnd={() => { setIsMoving(false); onDragEnd(); }}
      whileDrag={{ zIndex: 100, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 500, damping: 35, mass: 0.5 }}
      style={style} className="z-10 group/item"
    >
      <div 
        className={`flex-1 h-full w-full flex flex-col overflow-hidden relative shadow-sm border rounded-lg ${isMoving ? 'ring-2 ring-indigo-oxide shadow-2xl' : ''}`}
        style={{ 
          borderColor: accentColor || 'var(--border)',
          backgroundColor: accentColor ? `${accentColor}10` : 'var(--panel-bg)'
        }}
      >
        <Terminal projectId={id} onRemove={() => onRemove(id)} onDragStart={(e) => controls.start(e)} isDragging={isMoving} />
      </div>
    </motion.div>
  );
};
