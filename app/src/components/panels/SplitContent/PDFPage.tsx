
import { useEffect, useRef, memo } from 'react';

export const PDFPage = memo(({ pdf, pageNo }: { pdf: any, pageNo: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let task: any = null;
    const render = async () => {
      if (!pdf || !canvasRef.current) return;
      try {
        const page = await pdf.getPage(pageNo);
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        const viewport = page.getViewport({ scale: 1.5 });
        canvas.height = viewport.height; canvas.width = viewport.width;
        task = page.render({ canvasContext: ctx, viewport });
        await task.promise;
      } catch (err: any) { if (err.name !== 'RenderingCancelledException') {} }
    };
    render();
    return () => task?.cancel();
  }, [pdf, pageNo]);

  return <div className="bg-white border border-gray-100 shadow-sm mb-10"><canvas ref={canvasRef} className="w-[850px] h-auto block" /></div>;
});

PDFPage.displayName = 'PDFPage';
