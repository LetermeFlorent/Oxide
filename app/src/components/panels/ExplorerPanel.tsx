/**
 * @file ExplorerPanel.tsx
 * @description Wrapper component for the file explorer sidebar
 * Provides a styled container with header for the file tree
 *
 * Features:
 * - Consistent explorer styling with header
 * - Wraps the Sidebar component
 * - Responsive height filling
 *
 * @component ExplorerPanel
 */

import { Sidebar } from "../layout/Sidebar";

/**
 * Props for the ExplorerPanel component
 * @interface ExplorerPanelProps
 */
interface ExplorerPanelProps {
  /** Callback when a file is clicked in the explorer */
  onFileClick: (f: any) => void;
}

/**
 * ExplorerPanel Component
 *
 * A container component that wraps the Sidebar with consistent
 * styling including a header labeled "Explorer".
 *
 * @param props - Component props
 * @returns The explorer panel with sidebar content
 */
export const ExplorerPanel = ({ onFileClick }: ExplorerPanelProps) => (
  <div className="h-full flex flex-col bg-[#f9f9f9] border-r border-gray-200 overflow-hidden">
    <div className="h-10 px-4 flex items-center border-b border-gray-200 bg-white text-[10px] font-black uppercase text-gray-400">
      <span className="truncate">Explorer</span>
    </div>
    <Sidebar onFileClick={onFileClick} />
  </div>
);
