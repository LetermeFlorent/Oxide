import { ChevronRight, ChevronDown, Folder, FileText, File, Target } from "lucide-react";
import { memo } from "react";

export const TreeItemContent = memo(({ entry, isOpen, isSelected, isPdf, isFollowing, level, handleAction, handleContextMenu, onDoubleClick }: any) => (
  <div 
    className={`flex items-center py-1 px-4 cursor-pointer text-[12px] transition-all duration-150 ${isSelected ? 'bg-gray-50 text-black font-bold border-r-2 border-black' : 'hover:bg-gray-50 text-gray-600'}`} 
    style={{ paddingLeft: `${(level * 12) + 16}px` }} 
    onClick={handleAction} onContextMenu={handleContextMenu} onDoubleClick={onDoubleClick}
  >
    <div className="w-4 mr-1 flex items-center justify-center">
      {entry.isFolder && (isOpen ? <ChevronDown size={14} className="text-black" /> : <ChevronRight size={14} className="text-gray-400" />)}
    </div>
    <div className="mr-2 flex items-center justify-center relative">
      {entry.isFolder ? <Folder size={16} className={isOpen ? 'text-black' : 'text-gray-400'} /> : 
       isPdf ? <File size={16} className={isSelected ? 'text-orange-500' : 'text-orange-400'} /> : 
       <><FileText size={16} className={isSelected ? 'text-black' : 'text-gray-300'} />
       {isFollowing && <div className="absolute -top-1 -right-1 bg-orange-500 rounded-full border border-white"><Target size={8} className="text-white" /></div>}</>}
    </div>
    <span className="truncate flex-1 tracking-tight">{entry.name}</span>
  </div>
));
