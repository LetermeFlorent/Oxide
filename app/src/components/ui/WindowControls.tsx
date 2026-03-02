
import { memo, useMemo } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { X, Minus, Square } from "lucide-react";

export const WindowControls = memo(() => {
  const isMac = useMemo(() => navigator.userAgent.toLowerCase().includes('mac'), []);

  const handleMinimize = () => getCurrentWindow().minimize();
  const handleMaximize = () => getCurrentWindow().toggleMaximize();
  const handleClose = () => getCurrentWindow().close();

  // Mac-style (colored dots)
  if (isMac) {
    return (
      <div className="flex items-center gap-2 px-3 h-full shrink-0" data-tauri-drag-region>
        <button onClick={handleMinimize} className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 border border-yellow-700/10 transition-colors" />
        <button onClick={handleMaximize} className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 border border-green-700/10 transition-colors" />
        <button onClick={handleClose} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 border border-red-700/10 transition-colors" />
      </div>
    );
  }

  // Windows / Linux style (Modern Oxide look)
  return (
    <div className="flex items-center gap-1 px-2 h-full shrink-0" data-tauri-drag-region>
      <button onClick={handleMinimize} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-200/60 transition-all active:scale-90">
        <Minus size={14} className="text-gray-500" />
      </button>
      <button onClick={handleMaximize} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-200/60 transition-all active:scale-90">
        <Square size={10} className="text-gray-500" />
      </button>
      <button onClick={handleClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-all active:scale-90 group">
        <X size={16} className="text-gray-500 group-hover:text-red-600" />
      </button>
    </div>
  );
});

WindowControls.displayName = 'WindowControls';
