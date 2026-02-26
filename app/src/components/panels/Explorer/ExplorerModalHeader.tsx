
import { memo } from "react";
import { FilePlus, FolderPlus } from "lucide-react";
import { t } from "../../../i18n";

export const ExplorerModalHeader = memo(({ type, title }: { type: 'file' | 'folder', title?: string }) => {
  const Icon = type === 'file' ? FilePlus : FolderPlus;
  const label = title || (type === 'file' ? t('explorer.new_file') : t('explorer.new_folder'));
  const color = type === 'file' ? 'bg-blue-50 text-blue-500' : 'bg-orange-50 text-orange-500';

  return (
    <div className="flex items-center gap-3 mb-5">
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${color}`}><Icon size={20} /></div>
      <div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-0.5">{type === 'file' ? t('explorer.file') : t('explorer.folder')}</h3>
        <p className="text-[13px] font-bold text-gray-800 leading-none">{label}</p>
      </div>
    </div>
  );
});

ExplorerModalHeader.displayName = 'ExplorerModalHeader';
