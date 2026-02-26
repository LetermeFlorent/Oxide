import { memo, useState } from "react";
import { useStore } from "../../../store/useStore";
import { SidebarSettings } from "../../panels/Settings/SidebarSettings";
import { SessionSettings } from "../../panels/Settings/SessionSettings";
import { useShallow } from "zustand/react/shallow";
import { useSettingsActions } from "../../panels/Settings/index";
import { Monitor, Save, X, Trash2 } from "lucide-react";
import { t } from "../../../i18n";
import { ModalLayout } from "./ModalLayout";
import { ConfirmModal } from "../ConfirmModal";

export const SettingsModal = memo(() => {
  const show = useStore(s => s.showSettings);
  const toggle = useStore(s => s.toggleSettings);
  const global = useStore(useShallow(s => ({
    reopenLastFiles: s.reopenLastFiles, restoreFollowedFiles: s.restoreFollowedFiles,
    restoreGroups: s.restoreGroups, restoreTerminalOverviews: s.restoreTerminalOverviews,
    restoreActiveTab: s.restoreActiveTab, startOnOverview: s.startOnOverview,
    compactMode: s.compactMode, verticalTabs: s.verticalTabs,
    showProgressPercentage: s.showProgressPercentage, showProgressBar: s.showProgressBar
  })));
  const { localState, updateSetting, handleSave } = useSettingsActions(global);
  const [resetModal, setResetModal] = useState(false);

  if (!show) return null;

  return (
    <ModalLayout show={show} z={10000}>
      <div className="flex flex-col h-[600px] -m-10 bg-white rounded-[1.5rem] overflow-hidden">
        <div className="h-16 px-8 flex items-center justify-between border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-black flex items-center justify-center text-white"><Monitor size={16} /></div>
            <span className="text-sm font-black uppercase tracking-widest">{t('settings.title')}</span>
          </div>
          <button onClick={() => toggle(false)} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 transition-colors"><X size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-modern-thin p-10 space-y-12">
          <section className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">Visual Appearance</h4>
            <SidebarSettings state={localState} setSetting={updateSetting} />
          </section>
          <section className="space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">App Behavior</h4>
            <SessionSettings state={localState} setSetting={updateSetting} />
          </section>
          <div className="pt-6 border-t border-gray-50 flex justify-center">
            <button onClick={() => setResetModal(true)} className="flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={14} /><span className="text-[10px] font-bold uppercase tracking-tight">Initialize Factory Reset</span></button>
          </div>
        </div>
        <div className="h-20 px-8 flex items-center justify-end border-t border-gray-100 bg-gray-50/30 shrink-0">
          <button onClick={handleSave} className="flex items-center gap-2 px-10 h-12 bg-black text-white text-[10px] font-black uppercase rounded-xl shadow-xl shadow-black/10 active:scale-95 transition-all"><Save size={14} />{t('settings.save')}</button>
        </div>
      </div>
      <ConfirmModal show={resetModal} onHide={() => setResetModal(false)} title="Factory Reset?" message="This will purge all local data." confirmLabel="Reset" cancelLabel="Cancel" kind="danger" onConfirm={() => { useStore.getState().resetWorkspace(); window.location.reload(); }} />
    </ModalLayout>
  );
});
SettingsModal.displayName = 'SettingsModal';
