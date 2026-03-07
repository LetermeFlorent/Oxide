import { ModalLayout } from "../../ui/Modals/index";
import { Check, Trash2, X } from "lucide-react";
import { safeKey } from "../../../utils/ui/keyUtils";

export const CloseTabsModal = ({ show, onHide, allTabs, selectedIds, onToggle, onSelectAll, onConfirm }: any) => {
  return (
    <ModalLayout show={show} onHide={onHide}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 leading-tight">Close Tabs</h3>
          <p className="text-2xl font-black text-foreground tracking-tight leading-none uppercase">Selection</p>
        </div>
        <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <button onClick={onSelectAll} className="text-[10px] font-bold text-foreground/40 hover:text-foreground transition-all">
            {selectedIds.length === allTabs.length ? 'Deselect All' : 'Select All'}
          </button>
          <span className="text-[10px] font-bold text-foreground/40">{selectedIds.length} selected</span>
        </div>
        <div className="max-h-60 overflow-y-auto scrollbar-modern-thin space-y-1 p-1">
          {allTabs.filter((t: any) => t?.id?.trim()).map((tab: any, idx: number) => (
            <div key={safeKey('close-tab', tab.id, idx)} onClick={() => onToggle(tab.id)} className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${selectedIds.includes(tab.id) ? 'bg-sidebar-bg border border-border' : 'hover:bg-sidebar-bg border border-transparent'}`}>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-foreground/60 truncate max-w-[200px]">{tab.name}</span>
                <span className="text-[8px] font-medium text-foreground/40 uppercase tracking-widest">{tab.type}</span>
              </div>
              <div className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${selectedIds.includes(tab.id) ? 'bg-black border-black text-white' : 'bg-panel-bg border-border'}`}>
                {selectedIds.includes(tab.id) && <Check size={12} strokeWidth={3} />}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2 pt-2">
          <button onClick={onHide} className="flex-1 py-3 rounded-2xl border border-border text-[10px] font-bold hover:bg-sidebar-bg transition-all">Cancel</button>
          <button onClick={onConfirm} disabled={selectedIds.length === 0} className="flex-1 py-3 rounded-2xl bg-red-500 text-white text-[10px] font-bold hover:bg-red-600 disabled:opacity-20 disabled:hover:bg-red-500 transition-all flex items-center justify-center gap-2">
            <Trash2 size={12} /> Close Selected
          </button>
        </div>
      </div>
    </div>
    </ModalLayout>
  );
};
