/**
 * @file SettingsPanel.tsx
 * @description Application settings modal with toggle switches for various features
 * Provides a centralized interface for customizing IDE behavior and appearance
 * 
 * Features:
 * - Sidebar display options (compact mode, vertical tabs)
 * - Progress tracking toggles (percentage, visual gauge)
 * - Session persistence settings
 * - Animated toggle switches with smooth transitions
 * - Auto-save functionality (changes apply immediately)
 * 
 * @component SettingsPanel
 * @example
 * <SettingsPanel />
 */

import { Settings, Percent, BarChart, X, Layout, FileText, Bookmark, Library, Terminal, Columns } from "lucide-react";
import { memo } from "react";
import { useStore } from "../../store/useStore";
import { motion, AnimatePresence } from "framer-motion";

/**
 * SettingsPanel Component
 * 
 * Modal panel for managing application settings and preferences.
 * All changes are automatically persisted to the store.
 * 
 * @returns {JSX.Element} The settings modal interface
 */
export const SettingsPanel = memo(() => {
  const showSettings = useStore(s => s.showSettings);
  const toggleSettings = useStore(s => s.toggleSettings);
  const showProgressPercentage = useStore(s => s.showProgressPercentage);
  const showProgressBar = useStore(s => s.showProgressBar);
  const reopenLastFiles = useStore(s => s.reopenLastFiles);
  const restoreFollowedFiles = useStore(s => s.restoreFollowedFiles);
  const restoreGroups = useStore(s => s.restoreGroups);
  const restoreTerminalOverviews = useStore(s => s.restoreTerminalOverviews);
  const startOnOverview = useStore(s => s.startOnOverview);
  const restoreActiveTab = useStore(s => s.restoreActiveTab);
  const compactMode = useStore(s => s.compactMode);
  const verticalTabs = useStore(s => s.verticalTabs);
  const setSetting = useStore(s => s.setSetting);

  return (
    <AnimatePresence>
      {showSettings && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => toggleSettings(false)}
            className="absolute inset-0 bg-black/5 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            className="relative w-full max-w-md bg-white border border-gray-200/60 rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="h-10 px-4 flex items-center justify-between border-b border-gray-100 bg-white">
              <div className="flex items-center gap-2">
                <Settings size={14} className="text-indigo-600" />
                <span className="text-[10px] font-black uppercase tracking-tighter text-gray-400">Settings</span>
              </div>
              <button 
                onClick={() => toggleSettings(false)} 
                className="p-1 hover:bg-gray-100 rounded text-gray-400 transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto scrollbar-modern">
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Layout size={12} className="text-gray-400" />
                  <h3 className="text-[9px] font-black uppercase tracking-widest text-gray-400">Sidebar Display</h3>
                </div>
                
                <div className="space-y-2">
                  <ToggleItem 
                    icon={Layout} 
                    label="Compact Mode" 
                    active={compactMode} 
                    onClick={() => setSetting('compactMode', !compactMode)} 
                  />
                  <ToggleItem 
                    icon={Columns} 
                    label="Vertical Tabs" 
                    active={verticalTabs} 
                    onClick={() => setSetting('verticalTabs', !verticalTabs)} 
                  />
                  <ToggleItem 
                    icon={Percent} 
                    label="Progress Score" 
                    active={showProgressPercentage} 
                    onClick={() => setSetting('showProgressPercentage', !showProgressPercentage)} 
                  />
                  <ToggleItem 
                    icon={BarChart} 
                    label="Visual Gauge" 
                    active={showProgressBar} 
                    onClick={() => setSetting('showProgressBar', !showProgressBar)} 
                  />
                </div>
              </section>

              <section>
                <div className="flex items-center gap-2 mb-4">
                  <FileText size={12} className="text-gray-400" />
                  <h3 className="text-[9px] font-black uppercase tracking-widest text-gray-400">Session & Files</h3>
                </div>
                
                <div className="space-y-2">
                  <ToggleItem 
                    icon={FileText} 
                    label="Reopen Files" 
                    active={reopenLastFiles} 
                    onClick={() => setSetting('reopenLastFiles', !reopenLastFiles)} 
                  />
                  <ToggleItem 
                    icon={Bookmark} 
                    label="Restore Followed" 
                    active={restoreFollowedFiles} 
                    onClick={() => setSetting('restoreFollowedFiles', !restoreFollowedFiles)} 
                  />
                  <ToggleItem 
                    icon={Library} 
                    label="Reopen Groups" 
                    active={restoreGroups} 
                    onClick={() => setSetting('restoreGroups', !restoreGroups)} 
                  />
                  <ToggleItem 
                    icon={Terminal} 
                    label="Reopen Overviews" 
                    active={restoreTerminalOverviews} 
                    onClick={() => setSetting('restoreTerminalOverviews', !restoreTerminalOverviews)} 
                  />
                  <ToggleItem 
                    icon={Bookmark} 
                    label="Restore Active Tab" 
                    active={restoreActiveTab} 
                    onClick={() => setSetting('restoreActiveTab', !restoreActiveTab)} 
                  />
                  <ToggleItem 
                    icon={Layout} 
                    label="Always on Overview" 
                    active={startOnOverview} 
                    onClick={() => setSetting('startOnOverview', !startOnOverview)} 
                  />
                </div>
              </section>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Oxide v0.1.0</span>
                <span className="text-[8px] font-medium text-gray-400 italic">Changes saved automatically</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

/**
 * ToggleItem Component
 * 
 * Individual toggle switch component for settings items.
 * Features animated sliding indicator and hover effects.
 * 
 * @param {Object} props - Component props
 * @param {React.ComponentType} props.icon - Lucide icon component to display
 * @param {string} props.label - Display label for the setting
 * @param {boolean} props.active - Current toggle state
 * @param {() => void} props.onClick - Callback when toggle is clicked
 * @returns {JSX.Element} The toggle switch interface
 */
const ToggleItem = ({ icon: Icon, label, active, onClick }: any) => (
  <div 
    onClick={onClick}
    className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl cursor-pointer hover:bg-gray-50 transition-all group"
  >
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
        active ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-50 text-gray-400'
      }`}>
        <Icon size={14} />
      </div>
      <span className="text-[10px] font-bold text-gray-600 uppercase tracking-tight">
        {label}
      </span>
    </div>
    <div className={`w-8 h-4 rounded-full relative transition-all ${active ? 'bg-indigo-600' : 'bg-gray-200'}`}>
      <motion.div 
        animate={{ x: active ? 18 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-1 w-2 h-2 bg-white rounded-full shadow-sm"
      />
    </div>
  </div>
);

SettingsPanel.displayName = 'SettingsPanel';
