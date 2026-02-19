import { memo, useState, useEffect } from "react";
import { useStore } from "../../store/useStore";
import { SidebarSettings } from "./Settings/SidebarSettings";
import { SessionSettings } from "./Settings/SessionSettings";
import { t } from "../../i18n";
import { useShallow } from "zustand/react/shallow";
import { Save, RotateCcw, AlertTriangle, Monitor, Cpu, History } from "lucide-react";

type SettingsCategory = 'appearance' | 'behavior';

export const SettingsPanel = memo(() => {
  const { toggleSettings, setSetting, ...globalState } = useStore(useShallow(s => ({
    toggleSettings: s.toggleSettings, setSetting: s.setSetting,
    compactMode: s.compactMode, verticalTabs: s.verticalTabs,
    showProgressPercentage: s.showProgressPercentage, showProgressBar: s.showProgressBar,
    reopenLastFiles: s.reopenLastFiles, restoreFollowedFiles: s.restoreFollowedFiles,
    restoreGroups: s.restoreGroups, restoreTerminalOverviews: s.restoreTerminalOverviews,
    restoreActiveTab: s.restoreActiveTab, startOnOverview: s.startOnOverview
  })));

  const [localState, setLocalState] = useState(globalState);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [activeCategory, setActiveCategory] = useState<SettingsCategory>('appearance');

  useEffect(() => {
    setLocalState(globalState);
  }, []);

  const updateSetting = (key: string, value: boolean) => {
    setLocalState(prev => {
      const next = { ...prev, [key]: value };
      if (key === 'reopenLastFiles' && !value) { 
        next.restoreFollowedFiles = false; 
        next.restoreActiveTab = false; 
      }
      if (key === 'restoreActiveTab' && value && !next.reopenLastFiles) {
        next.reopenLastFiles = true;
      }
      return next;
    });
  };

  const handleSave = () => {
    Object.entries(localState).forEach(([k, v]) => {
      if ((globalState as any)[k] !== v) {
        setSetting(k as any, v as boolean);
      }
    });
    toggleSettings(false);
  };

  const navItems = [
    { id: 'appearance', label: 'Appearance', icon: Monitor, desc: 'Customize the UI and layout' },
    { id: 'behavior', label: 'Behavior', icon: Cpu, desc: 'Control session and file handling' }
  ];

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden">
      <div className="p-6 border-b border-gray-50 flex items-center justify-between shrink-0 bg-white z-10">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <Monitor size={16} className="text-white" />
          </div>
          <div>
            <h2 className="text-[12px] font-black uppercase tracking-[0.2em] text-gray-800 leading-none mb-1">{t('settings.title')}</h2>
            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest italic">User Preferences & Core Engine Config</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => toggleSettings(false)} className="px-4 py-2 text-gray-400 hover:text-black text-[9px] font-black uppercase transition-colors tracking-widest">Discard</button>
          <button 
            onClick={handleSave} 
            className="flex items-center gap-2 px-6 py-2.5 bg-black text-white text-[9px] font-black uppercase rounded-xl hover:bg-gray-800 transition-all shadow-xl shadow-black/10 active:scale-95 tracking-[0.1em]"
          >
            <Save size={12} />
            {t('settings.save')}
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <div className="w-64 border-r border-gray-50 bg-gray-50/50 flex flex-col p-4 shrink-0">
          <div className="space-y-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveCategory(item.id as SettingsCategory)}
                className={`w-full flex items-start gap-3 p-3 rounded-xl transition-all text-left ${activeCategory === item.id ? 'bg-white shadow-sm border border-gray-100' : 'hover:bg-white/50 opacity-60 hover:opacity-100'}`}
              >
                <div className={`mt-0.5 p-1.5 rounded-lg ${activeCategory === item.id ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'}`}>
                  <item.icon size={14} />
                </div>
                <div className="min-w-0">
                  <div className={`text-[9px] font-black uppercase tracking-widest ${activeCategory === item.id ? 'text-black' : 'text-gray-500'}`}>{item.label}</div>
                  <div className="text-[8px] font-medium text-gray-400 truncate mt-0.5">{item.desc}</div>
                </div>
              </button>
            ))}
          </div>
          
          <div className="mt-auto pt-4 border-t border-gray-100">
            <button 
              onClick={() => setShowResetConfirm(true)}
              className="w-full flex items-center gap-2 p-3 text-red-400 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all"
            >
              <History size={14} />
              <span className="text-[9px] font-black uppercase tracking-widest">Reset Core</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto scrollbar-modern p-12 bg-white">
          <div className="w-full">
            {activeCategory === 'appearance' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="mb-8">
                  <h3 className="text-[14px] font-black uppercase tracking-[0.2em] text-gray-800 mb-2">Display & Layout</h3>
                  <p className="text-[10px] text-gray-400 font-medium">Fine-tune the visual experience and workspace organization.</p>
                </div>
                <SidebarSettings state={localState} setSetting={updateSetting} />
              </div>
            )}
            
            {activeCategory === 'behavior' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="mb-8">
                  <h3 className="text-[14px] font-black uppercase tracking-[0.2em] text-gray-800 mb-2">Engine Behavior</h3>
                  <p className="text-[10px] text-gray-400 font-medium">Configure session persistence and automated task handling.</p>
                </div>
                <SessionSettings state={localState} setSetting={updateSetting} />
              </div>
            )}
          </div>
        </div>
      </div>

      {showResetConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/20 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-sm bg-white border border-gray-200 rounded-3xl shadow-2xl p-8 space-y-6">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} className="text-red-500" />
            </div>
            <div className="text-center">
              <h4 className="text-[12px] font-black uppercase tracking-[0.2em] text-gray-800 mb-2">Initialize Factory Reset?</h4>
              <p className="text-[10px] text-gray-400 font-medium leading-relaxed">This will purge all local project data, groups, and overviews. This protocol is irreversible.</p>
            </div>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => { useStore.getState().resetWorkspace(); window.location.reload(); }}
                className="w-full py-4 bg-red-500 text-white hover:bg-red-600 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-red-500/20 active:scale-95"
              >
                Execute Factory Reset
              </button>
              <button 
                onClick={() => setShowResetConfirm(false)}
                className="w-full py-4 bg-gray-50 text-gray-500 hover:bg-gray-100 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all"
              >
                Abort Protocol
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="px-6 py-3 border-t border-gray-50 bg-gray-50/30 flex items-center justify-between text-[8px] font-black text-gray-300 uppercase tracking-[0.4em]">
        <span>Oxide Core Runtime v0.1.0-alpha</span>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-green-400" /> SECURE_SESSION</span>
          <span className="flex items-center gap-1.5"><div className="w-1 h-1 rounded-full bg-blue-400" /> AUTO_SYNC_OFF</span>
        </div>
      </div>
    </div>
  );
});
