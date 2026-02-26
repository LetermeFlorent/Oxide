import { memo } from "react";
import { ModalLayout } from "./index";
import { ProjectSelectorList } from "../../layout/ActivityBar/ProjectSelectorList";
import { t } from "../../../i18n";
import { OverviewModalHeader } from "./OverviewModalHeader";
import { OverviewModalActions } from "./OverviewModalActions";

export const OverviewModal = memo(({ show, onHide, title, label, projects, selectedIds, onToggle, onConfirm, name = "", setName = null, onSelectAll = null }: any) => (
  <ModalLayout show={show} z={10000}>
    <div className="flex flex-col gap-8">
      <OverviewModalHeader title={title} label={label} setName={setName} />
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
      <OverviewModalActions onHide={onHide} onConfirm={onConfirm} disabled={(setName && !name.trim()) || !selectedIds.length} setName={setName} />
    </div>
  </ModalLayout>
));
OverviewModal.displayName = 'OverviewModal';
