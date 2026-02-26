
import { memo } from "react";
import { AlertTriangle, Trash2, Info } from "lucide-react";

export const ModalIcon = memo(({ kind }: { kind: string }) => {
  const cfg: any = { 
    danger: { c: 'bg-red-50 text-red-500', i: Trash2 },
    warning: { c: 'bg-orange-50 text-orange-500', i: AlertTriangle },
    info: { c: 'bg-blue-50 text-blue-500', i: Info }
  };
  const { c, i: Icon } = cfg[kind] || cfg.info;
  return (
    <div className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center mb-5 ${c}`}>
      <Icon size={28} />
    </div>
  );
});

ModalIcon.displayName = 'ModalIcon';
