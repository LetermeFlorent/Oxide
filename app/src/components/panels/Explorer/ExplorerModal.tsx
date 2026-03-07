import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, memo } from "react";
import { FilePlus, FolderPlus } from "lucide-react";
import { t } from "../../../i18n";

export const ExplorerModal = memo(({ show, type, onHide, onConfirm, title }: any) => {
  const [name, setName] = useState("");
  useEffect(() => { if (show) setName(""); }, [show]);
  if (!show) return null;
  const Icon = type === 'file' ? FilePlus : FolderPlus;
  const color = type === 'file' ? 'bg-blue-50 text-blue-500' : 'bg-orange-50 text-orange-500';

  return (
    <AnimatePresence><div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-black/50" onClick={onHide}>
      <motion.div onClick={e => e.stopPropagation()} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full max-w-xs bg-panel-bg border border-border rounded-[2rem] shadow-2xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${color}`}><Icon size={20} /></div>
          <div><h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground/40 mb-0.5">{type === 'file' ? t('explorer.file') : t('explorer.folder')}</h3><p className="text-[13px] font-bold text-foreground leading-none">{title || (type === 'file' ? t('explorer.new_file') : t('explorer.new_folder'))}</p></div>
        </div>
        <input autoFocus type="text" value={name} placeholder={type === 'file' ? t('explorer.file_placeholder') : t('explorer.folder_placeholder')} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && name.trim()) onConfirm(name.trim()); if (e.key === 'Escape') onHide(); }} className="w-full px-4 py-3.5 bg-sidebar-bg border border-border rounded-2xl text-[12px] font-bold text-foreground outline-none focus:border-foreground/20 focus:bg-panel-bg transition-all mb-5 placeholder:text-foreground/30" />
        <div className="flex gap-2">
          <button onClick={onHide} className="flex-1 py-3.5 bg-hover-bg hover:bg-active-bg text-foreground/60 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95">{t('common.cancel')}</button>
          <button disabled={!name.trim()} onClick={() => onConfirm(name.trim())} className="flex-1 py-3.5 bg-foreground hover:opacity-90 text-background rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-black/10 disabled:opacity-30 disabled:pointer-events-none">{t('common.create')}</button>
        </div>
      </motion.div>
    </div></AnimatePresence>
  );

});
ExplorerModal.displayName = 'ExplorerModal';
