import { memo } from "react";
import { Layout, Columns, Percent, BarChart } from "lucide-react";
import { ToggleItem } from "./ToggleItem";
import { t } from "../../../i18n";

export const SidebarSettings = memo(({ state, setSetting }: any) => (
  <section className="space-y-4">
    <div className="flex items-center gap-2"><Layout size={12} className="text-gray-400" /><h3 className="text-[9px] font-black uppercase tracking-widest text-gray-400">{t('settings.display')}</h3></div>
    <div className="space-y-2">
      <ToggleItem icon={Layout} label={t('settings.compact')} active={state.compactMode} onClick={() => setSetting('compactMode', !state.compactMode)} />
      <ToggleItem icon={Columns} label={t('settings.vertical')} active={state.verticalTabs} onClick={() => setSetting('verticalTabs', !state.verticalTabs)} />
      <ToggleItem icon={Percent} label={t('settings.percentage')} active={state.showProgressPercentage} onClick={() => setSetting('showProgressPercentage', !state.showProgressPercentage)} />
      <ToggleItem icon={BarChart} label={t('settings.gauge')} active={state.showProgressBar} onClick={() => setSetting('showProgressBar', !state.showProgressBar)} />
    </div>
  </section>
));
