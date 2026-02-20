import { memo, useState, useMemo } from "react";
import { ImageIcon, ChevronDown, ChevronRight } from "lucide-react";
import { ImageThumbnail } from "./ImageThumbnail";
import { t } from "../../../i18n";

export const ImageGallery = memo(({ images, onFileClick }: any) => {
  const [show, setShow] = useState(true);
  const displayImages = useMemo(() => (images || []).slice(0, 50), [images]);

  if (!images?.length) return null;

  return (
    <div className="border-t border-gray-100 bg-white/50 backdrop-blur-sm shrink-0 max-h-[45%] flex flex-col">
      <button onClick={() => setShow(!show)} className="w-full px-4 py-2 flex items-center justify-between hover:bg-gray-100/50 transition-colors">
        <div className="flex items-center gap-2">
          <ImageIcon size={14} className="text-orange-500" />
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{t('sidebar.images')} ({images.length})</span>
        </div>
        {show ? <ChevronDown size={12} className="text-gray-400" /> : <ChevronRight size={12} className="text-gray-400" />}
      </button>
      {show && (
        <div className="flex-1 overflow-y-auto pb-2 scrollbar-modern-thin">
          <div className="px-2 space-y-0.5">
            {displayImages.map((img: any) => (
              <div key={img.path} onClick={() => onFileClick(img)} className="flex items-center gap-2 p-1 hover:bg-orange-50 rounded-lg cursor-pointer group transition-all">
                <ImageThumbnail path={img.path} />
                <span className="text-[10px] font-bold text-gray-600 truncate flex-1 group-hover:text-orange-700">{img.name}</span>
              </div>
            ))}
            {images.length > 50 && <p className="text-[8px] text-center text-gray-400 py-2 uppercase font-black opacity-50 tracking-tighter">{t('sidebar.more_images', { count: images.length - 50 })}</p>}
          </div>
        </div>
      )}
    </div>
  );
});
