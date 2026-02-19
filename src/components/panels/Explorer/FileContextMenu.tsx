import { Pencil, Trash2, FolderSearch, FilePlus, FolderPlus } from "lucide-react";
import { motion } from "framer-motion";

export const FileContextMenu = ({ menu, onHide, onRename, onDelete, onReveal, onCreateFile, onCreateFolder }: any) => {
  if (!menu) return null;
  return (
    <div className="fixed inset-0 z-[1000]" onClick={onHide} onContextMenu={(e) => { e.preventDefault(); onHide(); }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        style={{ left: Math.min(menu.x, window.innerWidth - 180), top: Math.min(menu.y, window.innerHeight - 150) }} 
        className="absolute w-44 bg-white border border-gray-100 rounded-xl shadow-2xl p-1"
        onClick={(e) => e.stopPropagation()}
      >
        {onRename && typeof onRename === 'function' && menu.entry.path !== menu.entry.name && (
          <button className="w-full text-left flex items-center gap-2 px-3 py-2 text-[10px] font-bold text-gray-600 hover:bg-gray-50 rounded-lg" onClick={() => { onRename(menu.entry); onHide(); }}>
            <Pencil size={12}/> Rename
          </button>
        )}
        <button className="w-full text-left flex items-center gap-2 px-3 py-2 text-[10px] font-bold text-gray-600 hover:bg-gray-50 rounded-lg" onClick={() => { onReveal(menu.entry); onHide(); }}>
          <FolderSearch size={12}/> Reveal in Explorer
        </button>
        <div className="h-px bg-gray-50 my-1" />
        <button className="w-full text-left flex items-center gap-2 px-3 py-2 text-[10px] font-bold text-gray-600 hover:bg-gray-50 rounded-lg" onClick={() => { onCreateFile(menu.entry); onHide(); }}>
          <FilePlus size={12}/> New File
        </button>
        <button className="w-full text-left flex items-center gap-2 px-3 py-2 text-[10px] font-bold text-gray-600 hover:bg-gray-50 rounded-lg" onClick={() => { onCreateFolder(menu.entry); onHide(); }}>
          <FolderPlus size={12}/> New Folder
        </button>
        {onDelete && typeof onDelete === 'function' && menu.entry.path !== menu.entry.name && (
          <>
            <div className="h-px bg-gray-50 my-1" />
            <button className="w-full text-left flex items-center gap-2 px-3 py-2 text-[10px] font-bold text-red-500 hover:bg-red-50 rounded-lg" onClick={() => { onDelete(menu.entry); onHide(); }}>
              <Trash2 size={12}/> Delete
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
};
