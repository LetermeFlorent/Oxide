import { memo } from "react";
import { Layout, Columns, Percent, BarChart } from "lucide-react";
import { ToggleItem } from "./ToggleItem";
import { t } from "../../../i18n";

export const SidebarSettings = memo(({ state, setSetting }: any) => (
  <div className="space-y-2">
    <ToggleItem icon={Columns} label={t('settings.vertical')} active={state.verticalTabs} onClick={() => setSetting('verticalTabs', !state.verticalTabs)} />
    <ToggleItem icon={Percent} label={t('settings.percentage')} active={state.showProgressPercentage} onClick={() => setSetting('showProgressPercentage', !state.showProgressPercentage)} />
    <ToggleItem icon={BarChart} label={t('settings.gauge')} active={state.showProgressBar} onClick={() => setSetting('showProgressBar', !state.showProgressBar)} />
  </div>
));
