
import { memo } from "react";
import { useStore } from "../../store/useStore";
import { ConfirmModal } from "./ConfirmModal";
import { PromptModal } from "./PromptModal";
import { SettingsModal } from "./Modals/SettingsModal";

export const GlobalModals = memo(() => {
  const { confirmModal, setConfirmModal, promptModal, setPromptModal } = useStore();
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
        onConfirm={(val) => { if (promptModal?.onConfirm) promptModal.onConfirm(val); setPromptModal(null); }} 
      />
    </>
  );
});

GlobalModals.displayName = 'GlobalModals';
