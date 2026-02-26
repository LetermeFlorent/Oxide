
import { memo } from "react";
import { ModalLayout } from "./index";
import { ProjectSelectorList } from "../../layout/ActivityBar/ProjectSelectorList";
import { t } from "../../../i18n";
import { Plus, Check } from "lucide-react";

export const OverviewModal = memo(({ show, onHide, title, label, projects, selectedIds, onToggle, onConfirm, name = "", setName = null, onSelectAll = null }: any) => (
  <ModalLayout show={show} z={10000}>
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 leading-tight">{title}</h3>
        <p className="text-2xl font-black text-black tracking-tight leading-none uppercase">{label}</p>
      </div>
      {setName && (
        <div className="space-y-2">
          <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest pl-1">{t('overview.tab_name')}</label>
          <input value={name} onChange={e => setName(e.target.value)} autoFocus placeholder="Type a name..." className="w-full bg-transparent border-b-2 border-gray-100 focus:border-black transition-all h-10 px-1 text-sm font-bold outline-none placeholder:text-gray-200" />
        </div>
      )}
      <div className="flex flex-col">
        <div className="flex items-center justify-between mb-4 px-1">
          <label className="text-[9px] font-black uppercase text-gray-400 tracking-widest">{t('overview.projects_to_include')}</label>
          {onSelectAll && <button onClick={onSelectAll} className="text-[9px] font-black uppercase text-black hover:bg-gray-50 px-2 py-1 rounded-lg transition-colors">{selectedIds.length === projects.length ? t('common.deselect_all') : t('common.select_all')}</button>}
        </div>
        <div className="max-h-[300px] overflow-y-auto scrollbar-modern-thin pr-2"><ProjectSelectorList projects={projects} selectedIds={selectedIds} onToggle={onToggle} /></div>
      </div>
      <div className="flex gap-4 pt-4">
        <button onClick={onHide} className="px-6 h-12 rounded-lg text-gray-400 hover:text-black text-[10px] font-black uppercase tracking-widest transition-all">{t('common.cancel')}</button>
        <button disabled={(setName && !name.trim()) || !selectedIds.length} onClick={onConfirm} className={`flex-1 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${((setName && !name.trim()) || !selectedIds.length) ? 'bg-gray-50 text-gray-300 pointer-events-none' : 'bg-black text-white shadow-lg shadow-black/5 hover:shadow-black/10 active:scale-[0.98]'}`}>
          {setName ? <Plus size={14} strokeWidth={3} /> : <Check size={14} strokeWidth={3} />}
          <span>{setName ? t('overview.create') : t('common.confirm')}</span>
        </button>
      </div>
    </div>
  </ModalLayout>
));
OverviewModal.displayName = 'OverviewModal';
