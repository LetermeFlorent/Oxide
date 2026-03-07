
import { memo } from "react";
import { Terminal, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { t } from "../../../i18n";
import { ProjectSelectorList } from "./ProjectSelectorList";

export const OverviewConfigModal = memo(({ show, onClose, name, setName, projects, selectedIds, toggleProject, onSelectAll, onCreate }: any) => (
  <AnimatePresence>
    {show && (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/50">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="w-full max-w-sm bg-panel-bg border border-border rounded-3xl shadow-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2"><Terminal size={16} /><h3 className="text-[11px] font-black uppercase text-foreground/40">{t('overview.new')}</h3></div>
            <button onClick={onClose} className="p-1 hover:bg-hover-bg rounded-lg text-foreground/40"><X size={16} /></button>
          </div>
          <div className="space-y-6">
            <div>
              <label className="text-[9px] font-black uppercase text-foreground/40 block mb-2">{t('overview.tab_name')}</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={t('overview.placeholder')} className="w-full px-3 py-2 bg-sidebar-bg border border-border rounded-xl text-[11px] font-bold text-foreground outline-none focus:border-foreground/20" autoFocus />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[9px] font-black uppercase text-foreground/40">{t('overview.projects_to_include')}</label>
                <button onClick={onSelectAll} className="text-[8px] font-black uppercase text-foreground hover:underline">{selectedIds.length === projects.length ? t('common.deselect_all') : t('common.select_all')}</button>
              </div>
              <ProjectSelectorList projects={projects} selectedIds={selectedIds} onToggle={toggleProject} />
            </div>
            <button disabled={!name.trim() || !selectedIds.length} onClick={onCreate} className="w-full py-3 bg-foreground text-background rounded-xl text-[10px] font-black uppercase shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">{t('overview.create')}</button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
));

OverviewConfigModal.displayName = 'OverviewConfigModal';
