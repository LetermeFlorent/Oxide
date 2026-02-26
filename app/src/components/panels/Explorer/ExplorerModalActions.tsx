
import { memo } from "react";
import { t } from "../../../i18n";

export const ExplorerModalActions = memo(({ onHide, onConfirm, disabled }: any) => (
  <div className="flex gap-2">
    <button onClick={onHide} className="flex-1 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95">{t('common.cancel')}</button>
    <button disabled={disabled} onClick={onConfirm} className="flex-1 py-3.5 bg-black hover:bg-gray-800 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-black/10 disabled:opacity-30 disabled:pointer-events-none">{t('common.create')}</button>
  </div>
));

ExplorerModalActions.displayName = 'ExplorerModalActions';
