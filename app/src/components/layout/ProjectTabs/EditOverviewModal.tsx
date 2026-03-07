import { ModalLayout } from "../../ui/Modals/index";
import { Check, Grid, Terminal } from "lucide-react";
import { safeKey } from "../../../utils/ui/keyUtils";

export const EditOverviewModal = ({ show, onHide, projects, selectedIds, onToggle, onConfirm }: any) => {
  const toggleProject = (id: string) => onToggle(id);

  return (
    <ModalLayout show={show} onHide={onHide}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 leading-tight">Configure Grid</h3>
          <p className="text-2xl font-black text-foreground tracking-tight leading-none uppercase">Terminal Management</p>
        </div>
        <div className="flex flex-col gap-4">
        <div className="max-h-60 overflow-y-auto scrollbar-modern-thin space-y-1 p-1">
          {projects.filter((p: any) => p && p.id && p.id.trim() !== "").map((p: any, idx: number) => (
            <button key={safeKey('edit-ov', p.id, idx)} onClick={() => toggleProject(p.id)} className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${selectedIds.includes(p.id) ? 'bg-sidebar-bg border border-border' : 'hover:bg-sidebar-bg border border-transparent'}`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${selectedIds.includes(p.id) ? 'bg-black text-white' : 'bg-gray-100 text-foreground/40'}`}>
                  <Terminal size={14} />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-[10px] font-bold text-foreground/60 truncate max-w-[180px]">{p.name}</span>
                  <span className="text-[8px] font-medium text-foreground/40 uppercase tracking-widest">Project Terminal</span>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${selectedIds.includes(p.id) ? 'bg-black border-black text-white' : 'bg-panel-bg border-border'}`}>
                {selectedIds.includes(p.id) && <Check size={12} strokeWidth={3} />}
              </div>
            </button>
          ))}
        </div>
        <div className="flex gap-2 pt-2">
          <button onClick={onHide} className="flex-1 py-3 rounded-2xl border border-border text-[10px] font-bold hover:bg-sidebar-bg transition-all">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-3 rounded-2xl bg-black text-white text-[10px] font-bold hover:opacity-80 transition-all flex items-center justify-center gap-2">
            <Grid size={12} /> Save Layout
          </button>
        </div>
      </div>
    </div>
    </ModalLayout>
  );
};
