
import { memo, lazy, Suspense } from "react";
import { ZoomableContainer } from "../../ui/ZoomableContainer";
import { Loader2 } from "lucide-react";

const PDFCanvasRenderer = lazy(() => import("./PDFCanvasRenderer").then(m => ({ default: m.PDFCanvasRenderer })));

const Loading = () => (
  <div className="flex-1 flex items-center justify-center bg-white"><Loader2 className="w-6 h-6 animate-spin text-black" /></div>
);

export const BinaryViewer = memo(({ url, isPdf }: { url: string, isPdf: boolean }) => (
  <div className="flex-1 flex flex-col overflow-hidden">
    <ZoomableContainer>
      <div className="relative flex flex-col items-center justify-center min-h-full">
        {isPdf ? (
          <Suspense fallback={<Loading />}><PDFCanvasRenderer url={url} /></Suspense>
        ) : (
          <img src={url} alt="Preview" className="max-w-full h-auto block" />
        )}
      </div>
    </ZoomableContainer>
  </div>
));

BinaryViewer.displayName = 'BinaryViewer';
