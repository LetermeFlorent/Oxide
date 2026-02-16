/**
 * @file ProjectTabs.tsx
 * @description Project and terminal overview tab management with grouping support
 * Provides horizontal or vertical tabs for switching between open projects
 * 
 * Features:
 * - Support for both project tabs and terminal overview tabs
 * - Tab grouping with collapse/expand functionality
 * - Context menu for tab management (rename, group, close)
 * - Task progress visualization on tabs
 * - Status indicators (working, intervene, idle)
 * - Bulk tab closing with selection modal
 * 
 * @component ProjectTabs
 * @example
 * <ProjectTabs onOpen={() => openFolderDialog()} />
 */

import { X, Folder, Loader2, Terminal, ChevronRight, ChevronDown, Library, Pencil, Plus, Trash2, Check, Square, CheckSquare, Settings2 } from "lucide-react";
import { useStore } from "../../store/useStore";
import { memo, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * TabItem Component
 * 
 * Individual tab component representing either a project or terminal overview.
 * Displays status indicators, progress bars, and supports inline renaming.
 * 
 * @param {Object} props - Component props
 * @param {string} props.id - Unique identifier for the tab
 * @param {'overview' | 'project'} props.type - Type of tab (terminal overview or project)
 * @param {boolean} props.active - Whether this tab is currently active
 * @param {boolean} props.compactMode - Whether compact UI mode is enabled
 * @param {(id: string) => void} props.onClick - Callback when tab is clicked
 * @param {(id: string) => void} props.onClose - Callback when tab close button is clicked
 * @param {(e: any, id: string, type: any) => void} props.onContextMenu - Callback for right-click context menu
 * @param {string | null} props.renamingId - ID of tab currently being renamed
 * @param {string} props.tempName - Temporary name during rename operation
 * @param {(name: string) => void} props.setTempName - Setter for temporary name
 * @param {() => void} props.submitRename - Function to confirm rename
 * @param {boolean} props.vertical - Whether tabs are displayed vertically
 * @returns {JSX.Element} The tab item interface
 */
const TabItem = memo(({ id, type, active, compactMode, onClick, onClose, onContextMenu, renamingId, tempName, setTempName, submitRename, vertical }: any) => {
  const item = useStore(useCallback(s => 
    type === 'overview' ? s.terminalOverviews.find(o => o.id === id) : s.projects.find(p => p.id === id)
  , [id, type]));

  if (!item) return null;

  const Icon = type === 'overview' ? Terminal : Folder;
  const progress = (item as any).taskProgress;
  const status = (item as any).status;
  const isLoading = (item as any).isLoading;

  return (
    <div 
      onClick={() => renamingId !== id && onClick(id)}
      onContextMenu={(e) => { e.preventDefault(); onContextMenu(e, id, type); }}
      className={`group relative flex items-center gap-2 px-3 transition-all cursor-pointer shrink-0 overflow-hidden select-none ${vertical ? 'w-full h-10' : 'h-8 min-w-[140px] max-w-[200px] self-center'} ${
        active 
          ? (compactMode ? 'bg-white border-r border-gray-200 shadow-none' : 'bg-white border border-gray-100 shadow-sm rounded-lg') 
          : (compactMode ? 'bg-transparent text-gray-400 border-r border-gray-100' : 'bg-transparent text-gray-400 hover:bg-white/40 rounded-lg')
      } ${vertical && active ? 'border-l-4 border-l-indigo-500 !border-r-0 !rounded-none' : ''}`}
    >
      {progress !== null && progress !== undefined && (
        <div style={{ width: vertical ? '2px' : `${progress}%`, height: vertical ? `${progress}%` : '0.5px' }} className={`absolute left-0 bg-orange-400/40 transition-all duration-500 ${vertical ? 'top-0' : 'bottom-0'}`} />
      )}
      <div className="relative z-10 flex items-center gap-2 flex-1 min-w-0 pr-4">
        <div className="relative shrink-0 flex items-center justify-center w-4 h-4">
          {isLoading ? <Loader2 size={12} className="text-indigo-500 animate-spin" /> : <Icon size={12} className={active ? 'text-indigo-500' : 'text-gray-300'} />}
          {status === 'working' && !isLoading && <Loader2 size={14} className="absolute text-indigo-500/40 animate-spin" />}
          {(status === 'working' || status === 'intervene') && !isLoading && <span className={`absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full ${status === 'working' ? 'bg-indigo-500' : 'bg-orange-500'} animate-pulse`} />}
        </div>
        {renamingId === id ? (
          <input autoFocus value={tempName} onChange={(e) => setTempName(e.target.value)} onBlur={submitRename} onKeyDown={(e) => e.key === 'Enter' && submitRename()} onClick={(e) => e.stopPropagation()} className="bg-gray-100 border-none outline-none text-[9px] font-black uppercase w-full rounded px-1 text-gray-800" />
        ) : (
          <span className={`text-[9px] font-black uppercase tracking-tight truncate ${active ? 'text-gray-800' : 'text-gray-400'}`}>{item.name}</span>
        )}
      </div>
      <button onClick={(e) => { e.stopPropagation(); onClose(id); }} className={`absolute right-1.5 p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-red-500 transition-all ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}><X size={10} /></button>
    </div>
  );
});

/**
 * ProjectTabs Component
 * 
 * Main tab bar for managing open projects and terminal overviews.
 * Supports both horizontal and vertical layouts with grouping functionality.
 * 
 * @param {Object} props - Component props
 * @param {() => void} props.onOpen - Callback to open the add project dialog
 * @returns {JSX.Element} The tab bar interface
 */
export const ProjectTabs = memo(({ onOpen }: { onOpen: () => void }) => {
  const projects = useStore(s => s.projects);
  const terminalOverviews = useStore(s => s.terminalOverviews);
  const groups = useStore(s => s.groups) || [];
  const activeProjectId = useStore(s => s.activeProjectId);
  const compactMode = useStore(s => s.compactMode);
  const verticalTabs = useStore(s => s.verticalTabs);
  
  const { switchProject, closeProject, closeTerminalOverview, updateProject, updateTerminalOverview, deleteGroup, toggleGroup, moveToGroup, createGroup } = useStore();

  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [tempName, setTempName] = useState("");
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, itemId: string | null, groupId: string | null, type?: 'project' | 'overview' } | null>(null);
  
  const [showEditOverviewModal, setShowEditOverviewModal] = useState(false);
  const [editingOverviewId, setEditingOverviewId] = useState<string | null>(null);
  const [editingProjectIds, setEditingProjectIds] = useState<string[]>([]);

  const [showGroupModal, setShowGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState("New Group");
  const [pendingItemId, setPendingItemId] = useState<string | null>(null);

  const [showCloseModal, setShowCloseModal] = useState(false);
  const [selectedCloseIds, setSelectedCloseIds] = useState<string[]>([]);

  // Combine all tabs (projects and overviews) for bulk operations
  const allTabs = useMemo(() => [
    ...terminalOverviews.map(o => ({ id: o.id, name: o.name, type: 'overview' as const })),
    ...projects.map(p => ({ id: p.id, name: p.name, type: 'project' as const }))
  ], [projects, terminalOverviews]);

  /**
   * Open the overview configuration modal for editing
   * @param {string} id - The terminal overview ID to edit
   */
  const handleOpenEditOverview = (id: string) => {
    const overview = terminalOverviews.find(o => o.id === id);
    if (overview) {
      setEditingOverviewId(id);
      setEditingProjectIds(overview.projectIds);
      setShowEditOverviewModal(true);
    }
  };

  /**
   * Toggle a project's inclusion in the overview being edited
   * @param {string} id - The project ID to toggle
   */
  const toggleEditingProject = (id: string) => {
    setEditingProjectIds(prev => prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]);
  };

  /**
   * Save the updated project list to the terminal overview
   */
  const handleUpdateOverviewProjects = () => {
    if (editingOverviewId) {
      useStore.getState().setTerminalOverviewProjects(editingOverviewId, editingProjectIds);
      setShowEditOverviewModal(false);
    }
  };

  /**
   * Create a new group with the pending item
   */
  const handleCreateGroup = () => {
    if (newGroupName.trim() && pendingItemId) {
      createGroup(newGroupName.trim(), [pendingItemId]);
      setShowGroupModal(false);
      setPendingItemId(null);
      setNewGroupName("New Group");
    }
  };

  /**
   * Close all selected tabs from the bulk close modal
   */
  const handleCloseSelected = () => {
    selectedCloseIds.forEach(id => {
      const isOverview = terminalOverviews.some(o => o.id === id);
      if (isOverview) closeTerminalOverview(id);
      else closeProject(id);
    });
    setShowCloseModal(false);
    setSelectedCloseIds([]);
  };

  /**
   * Toggle selection of a tab in the bulk close modal
   * @param {string} id - The tab ID to toggle
   */
  const toggleCloseSelect = (id: string) => {
    setSelectedCloseIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  /**
   * Submit the rename operation for a tab
   */
  const submitRename = useCallback(() => {
    if (renamingId && tempName.trim()) {
      if (terminalOverviews.some(o => o.id === renamingId)) updateTerminalOverview(renamingId, tempName.trim());
      else updateProject(renamingId, { name: tempName.trim() });
    }
    setRenamingId(null);
  }, [renamingId, tempName, terminalOverviews, updateTerminalOverview, updateProject]);

  return (
    <div 
      onWheel={(e) => !verticalTabs && (e.currentTarget.scrollLeft += e.deltaY)} 
      className={`flex shrink-0 select-none ${verticalTabs ? 'flex-col gap-1 p-2 w-full h-full overflow-y-auto scrollbar-modern-thin' : `items-center overflow-x-auto scrollbar-modern-thin ${compactMode ? 'gap-0 h-8 border-b border-gray-200 bg-white' : 'gap-1 h-10 pb-1 -mx-1 px-1'}`}`}
    >
      <AnimatePresence>
        {showEditOverviewModal && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-black/20 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="w-full max-w-sm bg-white border border-gray-200 rounded-3xl p-6 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center"><Settings2 size={16} className="text-indigo-600" /></div>
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-800">Configure Grid</h3>
                </div>
                <button onClick={() => setShowEditOverviewModal(false)} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400"><X size={18} /></button>
              </div>
              <div className="flex-1 overflow-y-auto scrollbar-modern-thin space-y-1 pr-1 mb-6">
                {projects.map(p => (
                  <button key={p.id} onClick={() => toggleEditingProject(p.id)} className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${editingProjectIds.includes(p.id) ? 'bg-indigo-50 border border-indigo-100' : 'hover:bg-gray-50 border border-transparent'}`}>
                    <span className={`text-[11px] font-bold truncate ${editingProjectIds.includes(p.id) ? 'text-indigo-700' : 'text-gray-600'}`}>{p.name}</span>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${editingProjectIds.includes(p.id) ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-gray-200'}`}>
                      {editingProjectIds.includes(p.id) && <Check size={12} strokeWidth={4} />}
                    </div>
                  </button>
                ))}
              </div>
              <button disabled={editingProjectIds.length === 0} onClick={handleUpdateOverviewProjects} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-30 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-200 active:scale-95">Confirm Selection</button>
            </motion.div>
          </div>
        )}

        {showGroupModal && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-black/20 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="w-full max-w-xs bg-white border border-gray-200 rounded-3xl shadow-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center"><Library size={16} className="text-indigo-600" /></div>
                <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-800">New Group</h3>
              </div>
              <input autoFocus type="text" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleCreateGroup()} className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-[11px] font-bold text-gray-700 outline-none focus:border-indigo-500/50 transition-colors mb-4" />
              <div className="flex gap-2">
                <button onClick={() => setShowGroupModal(false)} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-[9px] font-black uppercase transition-all">Cancel</button>
                <button onClick={handleCreateGroup} className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[9px] font-black uppercase transition-all shadow-lg shadow-indigo-500/20">Create</button>
              </div>
            </motion.div>
          </div>
        )}

        {showCloseModal && (
          <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/20 backdrop-blur-md p-4" onClick={() => setShowCloseModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-white border border-gray-200 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh]" onClick={e => e.stopPropagation()}>
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center"><Trash2 size={20} className="text-red-500" /></div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-gray-800">Tab Management</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Close multiple items at once</p>
                  </div>
                </div>
                <button onClick={() => setShowCloseModal(false)} className="p-2 hover:bg-gray-200 rounded-xl transition-colors text-gray-400"><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-modern-thin">
                <button onClick={() => setSelectedCloseIds(selectedCloseIds.length === allTabs.length ? [] : allTabs.map(t => t.id))} className="w-full flex items-center justify-between p-3 hover:bg-indigo-50/50 rounded-2xl transition-all group border border-dashed border-indigo-100 mb-4 text-[11px] font-black uppercase text-indigo-600">
                  <span>Select All</span>
                  {selectedCloseIds.length === allTabs.length ? <CheckSquare size={18} className="text-indigo-500" /> : <Square size={18} className="text-indigo-200 group-hover:text-indigo-300" />}
                </button>
                {allTabs.map(tab => (
                  <div key={tab.id} onClick={() => toggleCloseSelect(tab.id)} className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${selectedCloseIds.includes(tab.id) ? 'bg-indigo-50 border border-indigo-100' : 'hover:bg-gray-50 border border-transparent'}`}>
                    <div className="flex items-center gap-3 min-w-0">
                      {tab.type === 'overview' ? <Terminal size={14} className="text-indigo-400 shrink-0" /> : <Folder size={14} className="text-gray-400 shrink-0" />}
                      <span className={`text-[11px] font-bold truncate ${selectedCloseIds.includes(tab.id) ? 'text-indigo-700' : 'text-gray-600'}`}>{tab.name}</span>
                    </div>
                    {selectedCloseIds.includes(tab.id) ? <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-200"><Check size={12} className="text-white" strokeWidth={4} /></div> : <div className="w-5 h-5 rounded-full border-2 border-gray-200 group-hover:border-gray-300" />}
                  </div>
                ))}
              </div>
              <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex gap-3">
                <button onClick={() => setShowCloseModal(false)} className="flex-1 py-3 bg-white border border-gray-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500">Cancel</button>
                <button disabled={selectedCloseIds.length === 0} onClick={handleCloseSelected} className="flex-[2] py-3 bg-red-500 hover:bg-red-600 disabled:opacity-30 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"><Trash2 size={14} /> Close {selectedCloseIds.length} tabs</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Groups */}
      {groups.map(group => {
        const groupProjects = projects.filter(p => p.id && p.groupId === group.id);
        const groupOverviews = terminalOverviews.filter(o => o.groupId === group.id);
        const isActive = activeProjectId === group.id || groupProjects.some(p => p.id === activeProjectId);
        return (
          <div key={group.id} className={`flex transition-all ${verticalTabs ? 'flex-col w-full' : 'items-center h-full'} ${compactMode ? 'bg-gray-100/50' : 'bg-gray-200/40 p-1 rounded-xl self-center gap-1'}`}>
            <div onClick={() => toggleGroup(group.id)} onContextMenu={(e) => { e.preventDefault(); setContextMenu({ x: e.clientX, y: e.clientY, itemId: null, groupId: group.id }); }} className={`flex items-center gap-2 px-2 h-full cursor-pointer transition-all ${compactMode ? (verticalTabs ? 'border-b border-gray-200 py-2' : 'border-r border-gray-200') : (verticalTabs ? 'py-2 px-3' : 'rounded-lg min-w-[80px]')} ${isActive ? 'text-indigo-600' : 'text-gray-500 hover:bg-white/40'}`}>
              {group.collapsed ? <ChevronRight size={10} /> : <ChevronDown size={10} />}
              <span className="text-[8px] font-black uppercase truncate max-w-[60px]">{group.name}</span>
            </div>
            {!group.collapsed && (
              <div className={`flex ${verticalTabs ? 'flex-col w-full pl-2 border-l border-gray-100 mt-1' : 'items-center h-full gap-1'}`}>
                {groupOverviews.map(o => (
                  <TabItem key={o.id} id={o.id} type="overview" active={activeProjectId === o.id} compactMode={compactMode} onClick={switchProject} onClose={closeTerminalOverview} onContextMenu={(e: any, id: string, type: any) => setContextMenu({ x: e.clientX, y: e.clientY, itemId: id, groupId: null, type })} renamingId={renamingId} tempName={tempName} setTempName={setTempName} submitRename={submitRename} vertical={verticalTabs} />
                ))}
                {groupProjects.map(p => (
                  <TabItem key={p.id} id={p.id} name={p.name} type="project" active={activeProjectId === p.id} compactMode={compactMode} onClick={switchProject} onClose={closeProject} onContextMenu={(e: any, id: string, type: any) => setContextMenu({ x: e.clientX, y: e.clientY, itemId: id, groupId: null, type })} renamingId={renamingId} tempName={tempName} setTempName={setTempName} submitRename={submitRename} vertical={verticalTabs} />
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Ungrouped Items */}
      {terminalOverviews.filter(o => !o.groupId).map(o => (
        <TabItem key={o.id} id={o.id} type="overview" active={activeProjectId === o.id} compactMode={compactMode} onClick={switchProject} onClose={closeTerminalOverview} onContextMenu={(e: any, id: string, type: any) => setContextMenu({ x: e.clientX, y: e.clientY, itemId: id, groupId: null, type })} renamingId={renamingId} tempName={tempName} setTempName={setTempName} submitRename={submitRename} vertical={verticalTabs} />
      ))}
      {projects.filter(p => !p.groupId).map(p => (
        <TabItem key={p.id} id={p.id} name={p.name} type="project" active={activeProjectId === p.id} compactMode={compactMode} onClick={switchProject} onClose={closeProject} onContextMenu={(e: any, id: string, type: any) => setContextMenu({ x: e.clientX, y: e.clientY, itemId: id, groupId: null, type })} renamingId={renamingId} tempName={tempName} setTempName={setTempName} submitRename={submitRename} vertical={verticalTabs} />
      ))}

      <div className={`flex items-center shrink-0 ${verticalTabs ? 'w-full py-4 border-t border-gray-100 mt-2 justify-center gap-4' : `px-2 ${compactMode ? 'h-full border-l border-gray-200 bg-white' : 'gap-1 ml-1'}`}`}>
        {allTabs.length > 2 && (
          <button onClick={() => setShowCloseModal(true)} title="Manage tabs" className={`p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all ${verticalTabs ? 'scale-125' : ''}`}><Trash2 size={12} /></button>
        )}
        <button onClick={onOpen} className={`p-1.5 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg ${verticalTabs ? 'scale-125' : ''}`}><Plus size={12} /></button>
      </div>

      <AnimatePresence>
        {contextMenu && (
          <div className="fixed inset-0 z-[1000]" onClick={() => setContextMenu(null)} onContextMenu={(e) => { e.preventDefault(); setContextMenu(null); }}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ left: Math.min(contextMenu.x, window.innerWidth - 180), top: contextMenu.y }} className="absolute w-44 bg-white border border-gray-100 rounded-xl shadow-2xl p-1">
              {contextMenu.itemId && (
                <>
                  <button className="w-full text-left flex items-center gap-2 px-3 py-2 text-[10px] font-bold text-gray-600 hover:bg-gray-50 rounded-lg" onClick={() => { 
                    const item = contextMenu.type === 'overview' ? terminalOverviews.find(o => o.id === contextMenu.itemId) : projects.find(p => p.id === contextMenu.itemId);
                    setRenamingId(contextMenu.itemId); setTempName(item?.name || ""); setContextMenu(null); 
                  }}><Pencil size={12}/> Rename</button>
                  {contextMenu.type === 'overview' && (
                    <button className="w-full text-left flex items-center gap-2 px-3 py-2 text-[10px] font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg" onClick={() => { handleOpenEditOverview(contextMenu.itemId!); setContextMenu(null); }}><Settings2 size={12}/> Configure Grid</button>
                  )}
                  <button className="w-full text-left flex items-center gap-2 px-3 py-2 text-[10px] font-bold text-gray-600 hover:bg-gray-50 rounded-lg" onClick={() => { setPendingItemId(contextMenu.itemId); setShowGroupModal(true); setContextMenu(null); }}><Plus size={12}/> Create Group</button>
                  <div className="h-px bg-gray-50 my-1" />
                  <span className="text-[8px] font-black uppercase text-gray-300 px-3 py-1 block">Add to</span>
                  {groups.map(g => (
                    <button key={g.id} className="w-full text-left flex items-center gap-2 px-3 py-2 text-[10px] font-bold text-gray-600 hover:bg-gray-50 rounded-lg" onClick={() => { moveToGroup(contextMenu.itemId!, g.id); setContextMenu(null); }}><Library size={12}/> {g.name}</button>
                  ))}
                  {(contextMenu.type === 'overview' ? terminalOverviews.find(o => o.id === contextMenu.itemId)?.groupId : projects.find(p => p.id === contextMenu.itemId)?.groupId) && (
                    <button className="w-full text-left flex items-center gap-2 px-3 py-2 text-[10px] font-bold text-red-400 hover:bg-red-50 rounded-lg" onClick={() => { moveToGroup(contextMenu.itemId!, null); setContextMenu(null); }}><X size={12}/> Remove from Group</button>
                  )}
                </>
              )}
              {contextMenu.groupId && (
                <button className="w-full text-left flex items-center gap-2 px-3 py-2 text-[10px] font-bold text-red-500 hover:bg-red-50 rounded-lg" onClick={() => { deleteGroup(contextMenu.groupId!); setContextMenu(null); }}><Trash2 size={12}/> Delete Group</button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
});

ProjectTabs.displayName = 'ProjectTabs';
