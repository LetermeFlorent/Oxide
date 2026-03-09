
import { memo } from "react";
import { t } from "../../../i18n";

export const GridEmptyState = memo(() => (
  <div className="flex-1 flex flex-col items-center justify-center text-foreground/40 gap-4 bg-panel-bg/50 border border-dashed border-border rounded-xl">
    <div className="w-12 h-12 rounded-2xl bg-foreground/5 flex items-center justify-center">
      <LayoutGrid size={24} />
    </div>
    <div className="text-center">
      <p className="text-[10px] font-black uppercase tracking-widest">{t('overview.empty')}</p>
      <p className="text-[9px] mt-1 opacity-60">{t('overview.empty_instruction')}</p>
    </div>
  </div>
));

GridEmptyState.displayName = 'GridEmptyState';
