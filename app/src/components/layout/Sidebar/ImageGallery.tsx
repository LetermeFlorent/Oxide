import { memo, useMemo } from "react";
import { Image, MoreHorizontal } from "lucide-react";
import { ImageThumbnail } from "./ImageThumbnail";
import { useStore } from "../../../store/useStore";
import { safeKey } from "../../../utils/ui/keyUtils";

export const ImageGallery = memo(({ projectId, images, onFileClick }: any) => {
  const compactMode = useStore(s => s.compactMode);
  const displayImages = useMemo(() => images.slice(0, 12), [images]);
  const hasMore = images.length > 12;

  if (images.length === 0) return null;

  return (
    <div className={`flex flex-col gap-2 ${compactMode ? 'p-1 bg-gray-50/50' : 'p-3 bg-white border border-gray-100 shadow-sm rounded-2xl'}`}>
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5 text-gray-400">
          <Image size={10} strokeWidth={3} />
          <span className="text-[9px] font-black uppercase tracking-widest italic">{images.length} Images</span>
        </div>
        {hasMore && <MoreHorizontal size={10} className="text-gray-300" />}
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {displayImages.map((img: any, idx: number) => (
          <div key={safeKey('img', img.path, idx)} onClick={() => onFileClick(img)} className="aspect-square group relative rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-black transition-all">
            <ImageThumbnail path={img.path} />
          </div>
        ))}
      </div>
    </div>
  );
});

ImageGallery.displayName = 'ImageGallery';
