
import { memo } from "react";
import { Loader2 } from "lucide-react";

export const LoadingFallback = () => (
  <div className="flex-1 flex items-center justify-center bg-panel-bg">
    <Loader2 className="w-6 h-6 animate-spin text-foreground" />
  </div>
);

export const PaneHeader = memo(({ icon: Icon, label }: { icon: any, label: string }) => (
  <div className="h-7 px-3 flex items-center gap-2 bg-sidebar-bg/50 border-b border-border shrink-0">
    <Icon size={10} className="text-foreground" />
    <span className="text-[8px] font-black text-foreground/40 uppercase tracking-widest">{label}</span>
  </div>
));

PaneHeader.displayName = 'PaneHeader';
