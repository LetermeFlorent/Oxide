/**
 * Project: Oxide App
 * Responsibility: Context Menu for Tabs and Groups
 * License: O.A.S - MS-RSL (Microsoft Reference Source License)
 * Copyright (c) 2026 O.A.S (Optimization & Quality). All rights reserved.
 */
import { Pencil, Settings2, Plus, Library, X, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

export const TabContextMenu = ({ menu, onHide, onRename, onConfigure, onCreateGroup, onMoveToGroup, groups, projects, terminalOverviews }: any) => {
  if (!menu) return null;
  return (
    <div className="fixed inset-0 z-[1000]" onClick={onHide} onContextMenu={(e) => { e.preventDefault(); onHide(); }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ left: Math.min(menu.x, window.innerWidth - 180), top: menu.y }} className="absolute w-44 bg-white border border-gray-100 rounded-xl shadow-2xl p-1">
        {menu.itemId && (
          <>
            <button className="w-full text-left flex items-center gap-2 px-3 py-2 text-[10px] font-bold text-gray-600 hover:bg-gray-50 rounded-lg" onClick={() => onRename(menu.itemId, menu.type)}><Pencil size={12}/> Rename</button>
            {menu.type === 'overview' && (
              <button className="w-full text-left flex items-center gap-2 px-3 py-2 text-[10px] font-bold text-black hover:bg-gray-50 rounded-lg" onClick={() => onConfigure(menu.itemId)}><Settings2 size={12}/> Configure Grid</button>
            )}
            <button className="w-full text-left flex items-center gap-2 px-3 py-2 text-[10px] font-bold text-gray-600 hover:bg-gray-50 rounded-lg" onClick={() => onCreateGroup(menu.itemId)}><Plus size={12}/> Create Group</button>
            <div className="h-px bg-gray-50 my-1" />
            <span className="text-[8px] font-black uppercase text-gray-300 px-3 py-1 block">Add to</span>
            {groups.filter((g: any) => g && g.id && g.id.trim() !== "").map((g: any) => (
              <button key={g.id} className="w-full text-left flex items-center gap-2 px-3 py-2 text-[10px] font-bold text-gray-600 hover:bg-gray-50 rounded-lg" onClick={() => onMoveToGroup(menu.itemId, g.id)}><Library size={12}/> {g.name}</button>
            ))}
            {(menu.type === 'overview' ? terminalOverviews.find((o: any) => o.id === menu.itemId)?.groupId : projects.find((p: any) => p.id === menu.itemId)?.groupId) && (
              <button className="w-full text-left flex items-center gap-2 px-3 py-2 text-[10px] font-bold text-red-400 hover:bg-red-50 rounded-lg" onClick={() => onMoveToGroup(menu.itemId, null)}><X size={12}/> Remove from Group</button>
            )}
          </>
        )}
        {menu.groupId && (
          <button className="w-full text-left flex items-center gap-2 px-3 py-2 text-[10px] font-bold text-red-500 hover:bg-red-50 rounded-lg" onClick={() => onMoveToGroup(null, null, menu.groupId)}><Trash2 size={12}/> Delete Group</button>
        )}
      </motion.div>
    </div>
  );
};
