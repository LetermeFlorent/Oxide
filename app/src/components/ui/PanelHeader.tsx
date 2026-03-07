
import { LucideIcon } from "lucide-react";
import { memo, ReactNode } from "react";

interface PanelHeaderProps {
  icon: LucideIcon;
  title: string;
  children?: ReactNode;
  className?: string;
}

export const PanelHeader = memo(({ icon: Icon, title, children, className = "" }: PanelHeaderProps) => (
  <div className={`h-8 px-3 flex items-center justify-between shrink-0 border-b border-border bg-panel-bg ${className}`}>
    <div className="flex items-center gap-2 overflow-hidden flex-1">
      <Icon size={12} className="text-foreground/60" />
      <span className="text-[9px] font-black uppercase tracking-widest text-foreground truncate">
        {title}
      </span>
    </div>
    <div className="flex items-center gap-1">
      {children}
    </div>
  </div>
));

PanelHeader.displayName = 'PanelHeader';
