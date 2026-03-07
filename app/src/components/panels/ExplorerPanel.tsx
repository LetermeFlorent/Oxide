
import { Sidebar } from "../layout/Sidebar";

export const ExplorerPanel = ({ onFileClick }: { onFileClick: (f: any) => void }) => (
  <div className="h-full flex flex-col bg-sidebar-bg border-r border-border overflow-hidden">
    <Sidebar onFileClick={onFileClick} />
  </div>
);
