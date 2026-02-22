/**
 * @file Terminal.tsx
 * @description Terminal container component with header and bash terminal
 * Wraps the BashTerminal component with project-specific UI elements
 * 
 * Features:
 * - Project existence validation with loading state
 * - Integrated terminal header with controls
 * - Compact mode support for space-efficient layouts
 * - Graceful handling of missing projects
 * 
 * @component Terminal
 * @example
 * <Terminal projectId="/path/to/project" />
 */

import { memo, useCallback } from "react";
import { useStore } from "../../store/useStore";
import { BashTerminal } from "./Terminal/BashTerminal";

/**
 * Terminal Component
 * 
 * Container component that validates project existence and renders
 * the terminal interface with header and bash shell.
 * 
 * @param {Object} props - Component props
 * @param {string} props.projectId - The project ID (path) to associate with this terminal
 * @returns {JSX.Element} The terminal interface with header and shell
 */
export const Terminal = memo(({ projectId, suffix = "" }: { projectId: string, suffix?: string }) => {
  const compactMode = useStore(s => s.compactMode);
  // ATOMIC: Check if project exists without subscribing to entire list
  // This prevents unnecessary re-renders when other projects change
  const exists = useStore(useCallback(s => 
    s.projects.some(p => p.id === projectId), [projectId]));

  // Show loading state if project doesn't exist yet
  if (!exists) {
    return (
      <div className={`flex-1 flex flex-col items-center justify-center bg-gray-50/30 border border-dashed border-gray-200 text-gray-400 ${compactMode ? '' : 'rounded-xl'}`}>
        <span className="text-[10px] font-black uppercase tracking-widest">Loading...</span>
      </div>
    );
  }

  return (
    <div className={`flex-1 flex flex-col bg-slate-50 overflow-hidden h-full ${compactMode ? '' : 'rounded-xl'}`}>
      <div className="flex-1 flex flex-col min-h-0 relative">
        <BashTerminal projectId={projectId} suffix={suffix} />
      </div>
    </div>
  );
});

Terminal.displayName = 'Terminal';
