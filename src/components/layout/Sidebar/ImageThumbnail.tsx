import { memo, useState, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { readFile } from "@tauri-apps/plugin-fs";
import { imageWorker } from "../../../utils/imageWorkerInstance";

export const ImageThumbnail = memo(({ path }: { path: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const handleMessage = (e: MessageEvent) => {
      if (!active || e.data.path !== path) return;
      if (e.data.thumbnail && canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          canvasRef.current.width = 32;
          canvasRef.current.height = 32;
          ctx.drawImage(e.data.thumbnail, 0, 0, 32, 32);
          e.data.thumbnail.close();
        }
        setLoading(false);
      } else if (e.data.error) setLoading(false);
    };

    imageWorker.addEventListener('message', handleMessage);
    readFile(path).then(bytes => {
      if (active) imageWorker.postMessage({ path, bytes }, [bytes.buffer]);
    }).catch(() => active && setLoading(false));
    
    return () => { active = false; imageWorker.removeEventListener('message', handleMessage); };
  }, [path]);

  return (
    <div className="w-8 h-8 rounded border border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden shrink-0 relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
          <Loader2 size={10} className="text-gray-400 animate-spin" />
        </div>
      )}
      <canvas ref={canvasRef} className="w-full h-full object-cover" />
    </div>
  );
});
