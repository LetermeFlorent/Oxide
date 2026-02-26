
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { t } from "../../../i18n";
import { ExplorerModalHeader, ExplorerModalActions } from "./index";

export const ExplorerModal = ({ show, type, onHide, onConfirm, title }: any) => {
  const [name, setName] = useState("");
  useEffect(() => { if (show) setName(""); }, [show]);
  if (!show) return null;

  return (
    <AnimatePresence><div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-black/10 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-xs bg-white border border-gray-100 rounded-[2rem] shadow-2xl p-6">
        <ExplorerModalHeader type={type} title={title} />
        <input autoFocus type="text" value={name} placeholder={type === 'file' ? t('explorer.file_placeholder') : t('explorer.folder_placeholder')} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && name.trim()) onConfirm(name.trim()); if (e.key === 'Escape') onHide(); }} className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-[12px] font-bold text-gray-700 outline-none focus:border-black/20 focus:bg-white transition-all mb-5 placeholder:text-gray-300" />
        <ExplorerModalActions onHide={onHide} onConfirm={() => onConfirm(name.trim())} disabled={!name.trim()} />
      </motion.div>
    </div></AnimatePresence>
  );
};
