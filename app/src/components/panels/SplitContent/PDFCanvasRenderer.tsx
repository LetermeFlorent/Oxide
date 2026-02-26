import { memo } from "react";
import { PDFPage } from "./PDFPage";
import { usePDFLoader } from "./usePDFLoader";
import { safeKey } from "../../../utils/ui/keyUtils";

export const PDFCanvasRenderer = memo(({ url }: { url: string }) => {
  const { pdf, containerRef } = usePDFLoader(url);

  return (
    <div ref={containerRef} className="flex-1 overflow-auto bg-gray-100/50 p-4 flex flex-col items-center gap-4 scrollbar-modern">
      {pdf && Array.from({ length: pdf.numPages }, (_, i) => i + 1).map((n, idx) => (
        <PDFPage key={safeKey('pdf-page', `${url}-${n}`, idx)} pdf={pdf} pageNo={n} />
      ))}
    </div>
  );
});

PDFCanvasRenderer.displayName = 'PDFCanvasRenderer';
