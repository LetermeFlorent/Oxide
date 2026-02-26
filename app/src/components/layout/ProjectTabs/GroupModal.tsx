import { Library } from "lucide-react";
import { memo } from "react";
import { ModalLayout } from "../../ui/Modals/index";
import { ModalButton, ModalInput } from "../../ui/Modals/ModalElements";

export const GroupModal = memo(({ show, onHide, newGroupName, setNewGroupName, onConfirm }: any) => {
  return (
    <ModalLayout show={show} z={5000}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-gray-50 text-gray-500">
          <Library size={20} />
        </div>
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-0.5">New Group</h3>
          <p className="text-[13px] font-bold text-gray-800 leading-none">Categorize your items</p>
        </div>
      </div>
      <ModalInput 
        autoFocus 
        value={newGroupName} 
        onChange={setNewGroupName} 
        onKeyDown={(e: any) => e.key === 'Enter' && onConfirm()} 
      />
      <div className="flex gap-2">
        <ModalButton label="Cancel" onClick={onHide} variant="secondary" />
        <ModalButton label="Create" disabled={!newGroupName.trim()} onClick={onConfirm} variant="primary" />
      </div>
    </ModalLayout>
  );
});

GroupModal.displayName = 'GroupModal';
