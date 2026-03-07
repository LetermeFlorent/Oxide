
import { memo } from "react";
import { ModalLayout, ModalIcon } from "./Modals/index";
import { ModalButton } from "./Modals/ModalElements";

export const ConfirmModal = memo(({ show, title, message, onHide, onConfirm, kind = 'danger', confirmLabel = "Confirm", cancelLabel = "Cancel" }: any) => {
  return (
    <ModalLayout show={show}>
      <div className="flex flex-col items-center text-center">
        <ModalIcon kind={kind} />
        <h3 className="text-[16px] font-black text-gray-900 mb-2 tracking-tight">{title}</h3>
        <p className="text-[12px] font-bold text-foreground/40 leading-relaxed mb-8 px-2">{message}</p>
        <div className="flex gap-2 w-full mt-2">
          <ModalButton label={cancelLabel} onClick={onHide} variant="secondary" />
          <ModalButton label={confirmLabel} onClick={() => { onConfirm(); onHide(); }} variant={kind === 'danger' ? 'danger' : 'primary'} />
        </div>
      </div>
    </ModalLayout>
  );
});

ConfirmModal.displayName = 'ConfirmModal';
