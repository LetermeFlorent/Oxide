/**
 * @file TerminalPanel.tsx
 * @description Container component for the terminal panel
 * Displays a terminal for the currently active project
 *
 * Features:
 * - Renders only when a project is active
 * - Styled container with border
 * - Wraps the Terminal component
 *
 * @component TerminalPanel
 */

import { Terminal } from "./Terminal";
import { useStore } from "../../store/useStore";

/**
 * TerminalPanel Component
 *
 * A container that displays a terminal for the active project.
 * Returns null if no project is currently active.
 *
 * @returns The terminal panel or null if no active project
 */
export const TerminalPanel = () => {
  const activeProjectId = useStore(s => s.activeProjectId);
  if (!activeProjectId) return null;
  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-200 overflow-hidden">
      <Terminal projectId={activeProjectId} />
    </div>
  );
};
