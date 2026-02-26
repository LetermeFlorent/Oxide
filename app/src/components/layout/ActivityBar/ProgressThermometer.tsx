
import { memo } from "react";
import { Target } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProgressThermometerProps {
  progress: number | null;
  showBar: boolean;
  showPercent: boolean;
}

export const ProgressThermometer = memo(({ progress, showBar, showPercent }: ProgressThermometerProps) => (
  <AnimatePresence>
    {progress !== null && (showBar || showPercent) && (
      <motion.div 
        key="thermometer-root"
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        exit={{ opacity: 0, y: 20 }} 
        className="w-full flex flex-col items-center gap-2 mb-4 px-2"
      >
        {showBar && (
          <div className="relative w-1.5 h-32 bg-gray-100 rounded-full overflow-hidden shadow-[inset:0_1px_2px_rgba(0,0,0,0.05)]">
            <motion.div initial={{ height: 0 }} animate={{ height: `${progress}%` }} transition={{ type: "spring", stiffness: 50, damping: 20 }} className="absolute bottom-0 left-0 w-full bg-orange-500 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.4)]" />
          </div>
        )}
        <div className="flex flex-col items-center">
          {showPercent && <span className="text-[8px] font-black text-orange-600 tracking-tighter leading-none">{progress}%</span>}
          {showBar && (
            <motion.div animate={progress === 100 ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}} transition={{ duration: 0.5 }}>
              <Target size={10} className="text-orange-400 mt-1" />
            </motion.div>
          )}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
));

ProgressThermometer.displayName = 'ProgressThermometer';
