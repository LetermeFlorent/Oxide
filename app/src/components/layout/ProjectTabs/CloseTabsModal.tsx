import { ModalLayout } from "../../ui/Modals/index";
import { Check, Trash2, X } from "lucide-react";
import { safeKey } from "../../../utils/ui/keyUtils";

export const CloseTabsModal = ({ show, onHide, allTabs, selectedIds, onToggle, onSelectAll, onConfirm }: any) => {
  return (
    <ModalLayout show={show} onHide={onHide} title="Close Tabs" label="Selection">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <button onClick={onSelectAll} className="text-[10px] font-bold text-gray-400 hover:text-black transition-all">
            {selectedIds.length === allTabs.length ? 'Deselect All' : 'Select All'}
          </button>
          <span className="text-[10px] font-bold text-gray-400">{selectedIds.length} selected</span>
        </div>
        <div className="max-h-60 overflow-y-auto scrollbar-modern-thin space-y-1 p-1">
          {allTabs.filter((t: any) => t?.id?.trim()).map((tab: any, idx: number) => (
            <div key={safeKey('close-tab', tab.id, idx)} onClick={() => onToggle(tab.id)} className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${selectedIds.includes(tab.id) ? 'bg-gray-50 border border-gray-100' : 'hover:bg-gray-50 border border-transparent'}`}>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-600 truncate max-w-[200px]">{tab.name}</span>
                <span className="text-[8px] font-medium text-gray-400 uppercase tracking-widest">{tab.type}</span>
              </div>
              <div className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${selectedIds.includes(tab.id) ? 'bg-black border-black text-white' : 'bg-white border-gray-200'}`}>
                {selectedIds.includes(tab.id) && <Check size={12} strokeWidth={3} />}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2 pt-2">
          <button onClick={onHide} className="flex-1 py-3 rounded-2xl border border-gray-100 text-[10px] font-bold hover:bg-gray-50 transition-all">Cancel</button>
          <button onClick={onConfirm} disabled={selectedIds.length === 0} className="flex-1 py-3 rounded-2xl bg-red-500 text-white text-[10px] font-bold hover:bg-red-600 disabled:opacity-20 disabled:hover:bg-red-500 transition-all flex items-center justify-center gap-2">
            <Trash2 size={12} /> Close Selected
          </button>
        </div>
      </div>
    </ModalLayout>
  );
};
