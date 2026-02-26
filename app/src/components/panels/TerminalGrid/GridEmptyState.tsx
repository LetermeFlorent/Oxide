
import { memo } from "react";
import { t } from "../../../i18n";

export const GridEmptyState = memo(({ compactMode }: { compactMode: boolean }) => (
  <div className={`flex-1 flex flex-col items-center justify-center text-gray-400 gap-4 bg-white/50 border border-dashed border-gray-200 ${compactMode ? '' : 'rounded-xl'}`}>
    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
      <span className="text-xl">⌨️</span>
    </div>
    <div className="text-center">
      <p className="text-[11px] font-black uppercase tracking-widest">{t('overview.empty')}</p>
      <p className="text-[9px] mt-1 italic">{t('overview.empty_instruction')}</p>
    </div>
  </div>
));

GridEmptyState.displayName = 'GridEmptyState';
