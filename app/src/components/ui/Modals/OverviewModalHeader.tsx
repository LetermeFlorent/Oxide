
import { Terminal, Settings2 } from "lucide-react";

export const OverviewModalHeader = ({ title, label, setName }: any) => (
  <div className="flex flex-col gap-1">
    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300 leading-tight">{title}</h3>
    <p className="text-2xl font-black text-black tracking-tight leading-none uppercase">{label}</p>
  </div>
);
