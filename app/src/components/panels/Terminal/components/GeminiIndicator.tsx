
import { memo } from "react";

export const GeminiIndicator = memo(({ active }: { active: boolean }) => {
  if (!active) return null;
  return (
    <div className="ml-4 px-2 py-0.5 bg-blue-600 rounded-md text-blue-50 flex items-center gap-1.5 shadow-[0_0_15px_rgba(37,99,235,0.4)] animate-in fade-in slide-in-from-right-4 duration-500 border border-blue-400/30">
      <span className="text-[8px] font-black tracking-[0.2em] uppercase">Gemini</span>
      <span className="flex h-1.5 w-1.5 relative">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-100 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-100"></span>
      </span>
    </div>
  );
});

GeminiIndicator.displayName = 'GeminiIndicator';
