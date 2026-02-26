
import { FolderOpen } from "lucide-react";
import { memo } from "react";
import { useStore } from "../../store/useStore";
import { t } from "../../i18n";

export const WelcomeScreen = memo(({ onOpen }: { onOpen: () => void }) => {
  const compactMode = useStore(s => s.compactMode);
  const rd = compactMode ? '' : 'rounded-2xl';
  const brd = compactMode ? '' : 'rounded-xl';

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center fade-in pointer-events-none">
      <div className="flex flex-col items-center gap-6 max-w-sm w-full pointer-events-auto">
        <div className={`w-20 h-20 bg-gray-50 flex items-center justify-center ${rd}`}>
          <FolderOpen size={40} className="text-black opacity-60" />
        </div>
        <div className="text-center">
          <h2 className="text-sm font-black text-gray-800 uppercase tracking-[0.2em] mb-2">{t('welcome.title')}</h2>
          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tight">{t('welcome.tagline')}</p>
        </div>
        <button onClick={onOpen} className={`w-full flex items-center justify-center gap-2 px-6 py-3 bg-black text-white text-[10px] font-black uppercase tracking-[0.1em] hover:bg-black transition-all active:scale-95 ${brd}`}>
          {t('welcome.open_folder')}
        </button>
      </div>
    </div>
  );
});

WelcomeScreen.displayName = 'WelcomeScreen';
