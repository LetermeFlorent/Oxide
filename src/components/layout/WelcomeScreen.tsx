/**
 * @file WelcomeScreen.tsx
 * @description Initial landing screen displayed when no project is open
 * Provides a clean entry point for users to open their first folder/workspace
 * 
 * @component WelcomeScreen
 * @example
 * <WelcomeScreen onOpen={() => handleOpenFolder()} />
 */

import { FolderOpen } from "lucide-react";
import { memo } from "react";
import { useStore } from "../../store/useStore";

/**
 * WelcomeScreen Component
 * 
 * Renders the application's welcome/landing screen with:
 * - Brand identity (logo, title, tagline)
 * - Primary call-to-action button to open a folder
 * - Responsive styling based on compact mode setting
 * 
 * @param {Object} props - Component props
 * @param {() => void} props.onOpen - Callback function triggered when user clicks "Open Folder"
 * @returns {JSX.Element} The welcome screen interface
 */
export const WelcomeScreen = memo(({ onOpen }: { onOpen: () => void }) => {
  // Access the compact mode state from global store for responsive styling
  const compactMode = useStore(s => s.compactMode);
  
  return (
    // Centered container with fade-in animation for smooth appearance
    // Use fixed positioning to center relative to the window, ignoring sidebars and layout constraints
    <div className="fixed inset-0 flex flex-col items-center justify-center fade-in pointer-events-none">
      {/* Main container for content - re-enable pointer events for interactions */}
      <div className="flex flex-col items-center gap-6 max-w-sm w-full pointer-events-auto">
        {/* Brand icon container with indigo accent color */}
        <div className={`w-20 h-20 bg-indigo-50 flex items-center justify-center ${compactMode ? '' : 'rounded-2xl'}`}>
          <FolderOpen size={40} className="text-indigo-500 opacity-60" />
        </div>
        
        {/* Text content section with brand messaging */}
        <div className="text-center">
          <h2 className="text-sm font-black text-gray-800 uppercase tracking-[0.2em] mb-2">Welcome to Oxide</h2>
          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">The next-gen workspace</p>
        </div>
        
        {/* Primary action button - opens folder picker dialog */}
        <button 
          onClick={onOpen} 
          className={`w-full flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.1em] hover:bg-indigo-700 transition-all active:scale-95 ${compactMode ? '' : 'rounded-xl'}`}
        >
          Open Folder
        </button>
      </div>
    </div>
  );
});

// Display name for React DevTools debugging
WelcomeScreen.displayName = 'WelcomeScreen';
