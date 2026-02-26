
import { Sidebar } from "../layout/Sidebar";

export const ExplorerPanel = ({ onFileClick }: { onFileClick: (f: any) => void }) => (
  <div className="h-full flex flex-col bg-[#f9f9f9] border-r border-gray-200 overflow-hidden">
    <Sidebar onFileClick={onFileClick} />
  </div>
);
