
import { memo } from "react";
import { Loader2 } from "lucide-react";

export const LoadingFallback = () => (
  <div className="flex-1 flex items-center justify-center bg-white">
    <Loader2 className="w-6 h-6 animate-spin text-black" />
  </div>
);

export const PaneHeader = memo(({ icon: Icon, label }: { icon: any, label: string }) => (
  <div className="h-7 px-3 flex items-center gap-2 bg-gray-50/50 border-b border-gray-100 shrink-0">
    <Icon size={10} className="text-black" />
    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
  </div>
));

PaneHeader.displayName = 'PaneHeader';
