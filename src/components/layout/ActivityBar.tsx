/**
 * @file ActivityBar.tsx
 * @description Left-side activity bar with quick actions and project progress
 * Provides access to core IDE functions and visualizes task progress
 * 
 * Features:
 * - Quick toggle for file explorer visibility
 * - Terminal overview creation modal
 * - Vertical progress thermometer for followed files
 * - Settings access button
 * - Context-aware progress visualization
 * 
 * @component ActivityBar
 * @example
 * <ActivityBar onOpenFolder={() => openFolderDialog()} />
 */

import { Terminal, PanelLeft, FolderOpen, Target, Settings, Check, X, Monitor } from "lucide-react";
import { useStore } from "../../store/useStore";
import { memo, useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { revealItemInDir as revealExplorer } from "@tauri-apps/plugin-opener";

import { selectActiveOverview } from "../../store/selectors";

/**
 * ActivityBar Component
 * 
 * Left sidebar containing primary navigation and action buttons.
 * Also displays a vertical progress thermometer when following task files.
 */
export const ActivityBar = memo(({ onOpenFolder }: { onOpenFolder: () => void }) => {
  const showExplorer = useStore(s => s.showExplorer);
  const toggleExplorer = useStore(s => s.toggleExplorer);
  const togglePreview = useStore(s => s.togglePreview);
  const showPreview = useStore(s => s.showPreview);
  const toggleSettings = useStore(s => s.toggleSettings);
  const showSettings = useStore(s => s.showSettings);
  const showProgressBar = useStore(s => s.showProgressBar);
  const showProgressPercentage = useStore(s => s.showProgressPercentage);
  const activeProjectId = useStore(s => s.activeProjectId);
  const projects = useStore(s => s.projects) || [];
  const addTerminalOverview = useStore(s => s.addTerminalOverview);
  const compactMode = useStore(s => s.compactMode);
  
  const activeOverview = useStore(selectActiveOverview);
  const isTerminalOverview = !!activeOverview;
  const isSettings = activeProjectId === 'settings';
  const shouldHideProjectIcons = isTerminalOverview || isSettings;
  
  const activeProject = useMemo(() => projects.find(p => p.id === activeProjectId), [projects, activeProjectId]);
  const progress = activeProject?.taskProgress ?? null;

  const [showConfigModal, setShowConfigModal] = useState(false);
  const [overviewName, setOverviewName] = useState("Terminal Overview");
  const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);

  // Initialize selected projects when modal opens with all current projects
  useEffect(() => {
    if (showConfigModal) {
      setSelectedProjectIds(projects.map(p => p.id));
      setOverviewName(`Overview ${projects.length > 0 ? "" : "Terminals"}`);
    }
  }, [showConfigModal, projects]);

  /**
   * Toggle a project's selection in the overview creation modal
   */
  const toggleProject = (id: string) => {
    setSelectedProjectIds(prev => 
      prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]
    );
  };

  /**
   * Create the terminal overview with selected projects
   */
  const handleCreate = () => {
    if (overviewName.trim()) {
      addTerminalOverview(overviewName.trim(), selectedProjectIds);
      setShowConfigModal(false);
    }
  };

  const handleFolderAction = async () => {
    if (activeProjectId && activeProjectId !== 'settings' && !shouldHideProjectIcons) {
      try {
        await revealExplorer(activeProjectId);
      } catch (err) {
        console.error("Failed to open explorer:", err);
      }
    } else {
      onOpenFolder();
    }
  };

  return (
    <div className={`w-12 flex flex-col items-center pt-4 pb-1 bg-white shrink-0 z-50 relative overflow-hidden ${compactMode ? 'border-r border-gray-200' : 'rounded-xl border border-gray-100'}`}>
      <IconButton id="new-overview" icon={Terminal} onClick={() => setShowConfigModal(true)} active={showConfigModal} activeColor="text-black" />
      
      <AnimatePresence mode="wait">
        {!shouldHideProjectIcons && (
          <motion.div 
            key="project-specific-icons"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-center"
          >
            <IconButton id="explorer" icon={PanelLeft} onClick={toggleExplorer} active={showExplorer} />
            <IconButton id="preview" icon={Monitor} onClick={togglePreview} active={showPreview} activeColor="text-blue-500" />
            <IconButton id="folder-action" icon={FolderOpen} onClick={handleFolderAction} />
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {showConfigModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/5 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-sm bg-white border border-gray-200 rounded-3xl shadow-2xl overflow-hidden p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Terminal size={16} className="text-black" />
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400">New Overview</h3>
                </div>
                <button onClick={() => setShowConfigModal(false)} className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 block mb-2">Tab Name</label>
                  <input 
                    type="text" 
                    value={overviewName}
                    onChange={(e) => setOverviewName(e.target.value)}
                    placeholder="Ex: Backend Monitoring"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[11px] font-bold text-gray-700 outline-none focus:border-black/50 transition-colors"
                    autoFocus
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Projects to Include</label>
                    <button 
                      onClick={() => setSelectedProjectIds(selectedProjectIds.length === projects.length ? [] : projects.map(p => p.id))}
                      className="text-[8px] font-black uppercase tracking-widest text-black hover:underline"
                    >
                      {selectedProjectIds.length === projects.length ? "Deselect All" : "Select All"}
                    </button>
                  </div>
                  <div className="max-h-48 overflow-y-auto scrollbar-modern-thin space-y-1 p-1">
                    {projects.filter(p => p && p.id && p.id.trim() !== "").map(p => (
                      <button
                        key={p.id}
                        onClick={() => toggleProject(p.id)}
                        className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 rounded-xl transition-colors group"
                      >
                        <span className="text-[10px] font-bold text-gray-600 truncate mr-2">{p.name}</span>
                        <div className={`w-4 h-4 rounded-md flex items-center justify-center border transition-all ${selectedProjectIds.includes(p.id) ? 'bg-black border-black text-white' : 'bg-white border-gray-200'}`}>
                          {selectedProjectIds.includes(p.id) && <Check size={10} strokeWidth={3} />}
                        </div>
                      </button>
                    ))}
                    {projects.length === 0 && (
                      <div className="py-4 text-center border-2 border-dashed border-gray-100 rounded-xl">
                        <span className="text-[9px] font-medium text-gray-400 italic">Open folders first</span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  disabled={!overviewName.trim() || selectedProjectIds.length === 0}
                  onClick={handleCreate}
                  className="w-full py-3 bg-black hover:bg-black disabled:opacity-50 disabled:hover:bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-black/20 active:scale-[0.98]"
                >
                  Create Overview
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex-1" />

      {/* Vertical progress bar "thermometer" for followed files */}
      <AnimatePresence>
        {progress !== null && (showProgressBar || showProgressPercentage) && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="w-full flex flex-col items-center gap-2 mb-4 px-2"
          >
            {showProgressBar && (
              <div className="relative w-1.5 h-32 bg-gray-100 rounded-full overflow-hidden shadow-[inset:0_1px_2px_rgba(0,0,0,0.05)]">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${progress}%` }}
                  transition={{ type: "spring", stiffness: 50, damping: 20 }}
                  className="absolute bottom-0 left-0 w-full bg-orange-500 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.4)]"
                />
              </div>
            )}
            <div className="flex flex-col items-center">
              {showProgressPercentage && <span className="text-[8px] font-black text-orange-600 tracking-tighter leading-none">{progress}%</span>}
              <motion.div
                animate={progress === 100 ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
                transition={{ duration: 0.5 }}
              >
                <Target size={10} className="text-orange-400 mt-1" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <IconButton id="settings" icon={Settings} onClick={() => toggleSettings()} active={showSettings} />
    </div>
  );
});

ActivityBar.displayName = 'ActivityBar';

/**
 * IconButton Component
 * 
 * Reusable icon button component for activity bar actions.
 * 
 * @param {Object} props - Component props
 * @param {React.ComponentType} props.icon - Lucide icon component
 * @param {() => void} props.onClick - Click handler
 * @param {boolean} [props.active=false] - Whether button is in active state
 * @param {string} [props.activeColor="text-black"] - Color class for active state
 * @returns {JSX.Element} The icon button
 */
const IconButton = memo(({ id, icon: Icon, onClick, active = false, activeColor = "text-black" }: { id: string, icon: any, onClick: () => void, active?: boolean, activeColor?: string }) => (
  <motion.button 
    whileHover={{ scale: 1.1, y: -2 }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick} 
    className={`p-2 mb-2 relative flex items-center justify-center rounded-lg transition-all duration-200 ${active ? `${activeColor} bg-gray-50/50` : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50/30'}`}
  >
    <Icon size={20} className="relative z-10" />
    <AnimatePresence>
      {active && (
        <motion.div 
          layoutId={`active-bar-${id}`}
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -5 }}
          className="absolute left-0 w-0.5 h-4 bg-current rounded-full" 
        />
      )}
    </AnimatePresence>
  </motion.button>
));

IconButton.displayName = 'IconButton';
