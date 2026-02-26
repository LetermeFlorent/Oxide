
import { motion, AnimatePresence } from "framer-motion";
import { memo, ReactNode } from "react";

export const ModalLayout = memo(({ show, children, z = 3000 }: { show: boolean, children: ReactNode, z?: number }) => (
  <AnimatePresence>
    {show && (
      <div key="modal-overlay" className="fixed inset-0 flex items-center justify-center p-6 bg-black/5 backdrop-blur-sm" style={{ zIndex: z }}>
        <motion.div initial={{ opacity: 0, scale: 0.98, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98, y: 10 }} className="w-full max-w-md bg-white border border-gray-100 rounded-[1.5rem] shadow-2xl p-10">
          {children}
        </motion.div>
      </div>
    )}
  </AnimatePresence>
));

ModalLayout.displayName = 'ModalLayout';
