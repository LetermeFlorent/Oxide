
import { memo } from "react";
import { AlertTriangle } from "lucide-react";
import { useStore } from "../../../store/useStore";

export const ResetConfirmModal = memo(({ onHide }: { onHide: () => void }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/50 animate-in fade-in">
    <div className="w-full max-w-sm bg-panel-bg border border-border rounded-[12px] shadow-2xl p-8 space-y-6">
      <div className="w-16 h-16 bg-red-500/10 rounded-[12px] flex items-center justify-center mx-auto mb-4"><AlertTriangle size={32} className="text-red-500" /></div>
      <div className="text-center">
        <h4 className="text-[12px] font-black uppercase tracking-[0.2em] text-foreground mb-2">Initialize Factory Reset?</h4>
        <p className="text-[10px] text-foreground/40 font-medium leading-relaxed">This will purge all local data. This protocol is irreversible.</p>
      </div>
      <div className="flex flex-col gap-2">
        <button onClick={() => { useStore.getState().resetWorkspace(); window.location.reload(); }} className="w-full py-4 bg-red-500 text-white hover:bg-red-600 text-[10px] font-black uppercase tracking-widest rounded-[12px] transition-all shadow-xl shadow-red-500/20 active:scale-95">Execute Factory Reset</button>
        <button onClick={onHide} className="w-full py-4 bg-sidebar-bg text-foreground/60 hover:bg-hover-bg text-[10px] font-black uppercase tracking-widest rounded-[12px] transition-all">Abort Protocol</button>
      </div>
    </div>
  </div>
));


ResetConfirmModal.displayName = 'ResetConfirmModal';
