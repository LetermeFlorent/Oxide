
import { Edit3 } from "lucide-react";
import { useState, useEffect, memo } from "react";
import { ModalLayout } from "./Modals/index";
import { ModalButton, ModalInput } from "./Modals/ModalElements";

export const PromptModal = memo(({ show, title, label, defaultValue, onHide, onConfirm }: any) => {
  const [value, setValue] = useState(defaultValue);
  useEffect(() => { if (show) setValue(defaultValue); }, [show, defaultValue]);

  const handleConfirm = () => { if (value.trim()) { onConfirm(value.trim()); onHide(); } };

  return (
    <ModalLayout show={show} z={4000}>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-gray-50 text-gray-500"><Edit3 size={20} /></div>
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-0.5">{title}</h3>
          <p className="text-[13px] font-bold text-gray-800 leading-none">{label}</p>
        </div>
      </div>
      <ModalInput 
        autoFocus 
        value={value} 
        onChange={setValue} 
        onKeyDown={(e: any) => { if (e.key === 'Enter') handleConfirm(); if (e.key === 'Escape') onHide(); }} 
      />
      <div className="flex gap-2">
        <ModalButton label="Cancel" onClick={onHide} variant="secondary" />
        <ModalButton label="OK" disabled={!value.trim()} onClick={handleConfirm} variant="primary" />
      </div>
    </ModalLayout>
  );
});

PromptModal.displayName = 'PromptModal';
