import { memo } from "react";
import { FileText, Bookmark, Library, Terminal, Layout } from "lucide-react";
import { ToggleItem } from "./ToggleItem";
import { t } from "../../../i18n";

export const SessionSettings = memo(({ state, setSetting }: any) => (
  <section className="space-y-4">
    <div className="flex items-center gap-2"><FileText size={12} className="text-gray-400" /><h3 className="text-[9px] font-black uppercase tracking-widest text-gray-400">{t('settings.session')}</h3></div>
    <div className="grid grid-cols-1 gap-2">
      <ToggleItem icon={FileText} label={t('settings.reopen')} active={state.reopenLastFiles} onClick={() => setSetting('reopenLastFiles', !state.reopenLastFiles)} />
      <ToggleItem icon={Bookmark} label={t('settings.followed')} active={state.restoreFollowedFiles} onClick={() => setSetting('restoreFollowedFiles', !state.restoreFollowedFiles)} />
      <ToggleItem icon={Library} label={t('settings.groups')} active={state.restoreGroups} onClick={() => setSetting('restoreGroups', !state.restoreGroups)} />
      <ToggleItem icon={Terminal} label={t('settings.overviews')} active={state.restoreTerminalOverviews} onClick={() => setSetting('restoreTerminalOverviews', !state.restoreTerminalOverviews)} />
      <ToggleItem icon={Bookmark} label={t('settings.active_tab')} active={state.restoreActiveTab} onClick={() => setSetting('restoreActiveTab', !state.restoreActiveTab)} />
      <ToggleItem icon={Layout} label={t('settings.always_overview')} active={state.startOnOverview} onClick={() => setSetting('startOnOverview', !state.startOnOverview)} />
    </div>
  </section>
));
