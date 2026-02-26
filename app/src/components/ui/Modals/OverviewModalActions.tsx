
import { Plus, Check } from "lucide-react";
import { t } from "../../../i18n";

export const OverviewModalActions = ({ onHide, onConfirm, disabled, setName }: any) => (
  <div className="flex gap-4 pt-4">
    <button onClick={onHide} className="px-6 h-12 rounded-lg text-gray-400 hover:text-black text-[10px] font-black uppercase tracking-widest transition-all">
      {t('common.cancel')}
    </button>
    <button disabled={disabled} onClick={onConfirm} className={`flex-1 h-12 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${disabled ? 'bg-gray-50 text-gray-300 pointer-events-none' : 'bg-black text-white shadow-lg shadow-black/5 hover:shadow-black/10 active:scale-[0.98]'}`}>
      {setName ? <Plus size={14} strokeWidth={3} /> : <Check size={14} strokeWidth={3} />}
      <span>{setName ? t('overview.create') : t('common.confirm')}</span>
    </button>
  </div>
);
