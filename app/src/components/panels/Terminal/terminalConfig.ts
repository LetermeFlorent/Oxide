
import { ITerminalOptions } from "xterm";

export const TERMINAL_CONFIG: ITerminalOptions = {
  cursorBlink: true, fontSize: 15, convertEol: true, scrollback: 5000,
  fontFamily: '"JetBrains Mono", Menlo, Monaco, Consolas, monospace',
  letterSpacing: 0, lineHeight: 1.4,
  allowProposedApi: true,
  theme: { 
    background: '#ffffff', foreground: '#1e293b', cursor: '#6366f1', 
    cursorAccent: '#ffffff', selectionBackground: 'rgba(99, 102, 241, 0.2)',
    black: '#000000', red: '#ef4444', green: '#10b981', yellow: '#f59e0b',
    blue: '#3b82f6', magenta: '#8b5cf6', cyan: '#06b6d4', white: '#cbd5e1'
  },
};
