
import { memo } from "react";
import { useStore } from "../../store/useStore";
import { ConfirmModal } from "./ConfirmModal";
import { PromptModal } from "./PromptModal";
import { SettingsModal } from "./Modals/SettingsModal";

export const GlobalModals = memo(() => {
  const confirmModal = useStore(s => s.confirmModal);
  const setConfirmModal = useStore(s => s.setConfirmModal);
  const promptModal = useStore(s => s.promptModal);
  const setPromptModal = useStore(s => s.setPromptModal);
  return (
    <>
      <SettingsModal />
      <ConfirmModal 
        show={!!confirmModal?.show} title={confirmModal?.title || ""} message={confirmModal?.message || ""} 
        kind={confirmModal?.kind} onHide={() => setConfirmModal(null)} onConfirm={confirmModal?.onConfirm || (() => {})} 
      />
      <PromptModal 
        show={!!promptModal?.show} title={promptModal?.title || ""} label={promptModal?.label || ""} 
        defaultValue={promptModal?.defaultValue || ""} onHide={() => setPromptModal(null)} 
        onConfirm={(val: string) => { if (promptModal?.onConfirm) promptModal.onConfirm(val); setPromptModal(null); }} 
      />
    </>
  );
});

GlobalModals.displayName = 'GlobalModals';
