/**
 * @file TerminalHeader.tsx
 * @description Terminal tab header with project path display
 * Shows the current terminal tab and project working directory
 *
 * Features:
 * - Terminal tab switching (Bash)
 * - Project path display with tooltip
 * - Active tab indication
 *
 * @component TerminalHeader
 */

import { Terminal as TerminalIcon } from "lucide-react";
import { useStore } from "../../../store/useStore";
import { memo } from "react";

/**
 * Props for the TerminalHeader component
 * @interface TerminalHeaderProps
 */
interface TerminalHeaderProps {
  /** Project ID (path) to display in the header */
  projectId: string;
}

/**
 * TerminalHeader Component
 *
 * Displays the terminal tab bar with the active terminal type
 * and shows the project path on the right side.
 *
 * @param props - Component props
 * @returns The terminal header component
 */
export const TerminalHeader = memo(({ projectId }: TerminalHeaderProps) => {
  const project = useStore(s => s.projects.find(p => p.id === projectId));
  const updateActive = useStore(s => s.updateActiveProject);

  if (!project) return <div className="h-8 bg-gray-50/50 border-b border-gray-100 shrink-0" />;

  return (
    <div className="h-8 px-3 flex items-center bg-gray-50/50 border-b border-gray-100 shrink-0 justify-between">
      <div className="flex items-center gap-4 h-full">
        <Tab
          active={project.terminalTab === 'bash'}
          onClick={() => updateActive({ terminalTab: 'bash' })}
          icon={TerminalIcon} label="Bash" activeClass="text-indigo-600"
        />
      </div>
      <div className="flex items-center gap-2 max-w-[70%]">
        <span className="text-[8px] font-black uppercase text-indigo-400 tracking-tighter truncate opacity-60">Path:</span>
        <span className="text-[9px] font-mono text-gray-500 truncate" title={project.id}>{project.id}</span>
      </div>
    </div>
  );
});

/**
 * Props for the Tab component
 * @interface TabProps
 */
interface TabProps {
  /** Whether this tab is currently active */
  active: boolean;
  /** Click handler for the tab */
  onClick: () => void;
  /** Lucide icon component to display */
  icon: React.ComponentType<{ size: number }>;
  /** Tab label text */
  label: string;
  /** CSS class for active state styling */
  activeClass: string;
  /** Whether the tab is disabled */
  disabled?: boolean;
}

/**
 * Tab Component
 *
 * Individual tab button for the terminal header.
 *
 * @param props - Component props
 * @returns The tab button element
 */
const Tab = memo(({ active, onClick, icon: Icon, label, activeClass, disabled }: TabProps) => (
  <button
    disabled={disabled}
    onClick={(e) => { e.stopPropagation(); onClick(); }}
    className={`flex items-center gap-1.5 h-full border-b-2 transition-all ${disabled ? 'opacity-50' : ''} ${active ? activeClass : 'border-transparent text-gray-400 hover:text-gray-600'}`}
  >
    <Icon size={12} />
    <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
  </button>
));
