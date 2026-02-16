/**
 * @file PDFCanvasRenderer.tsx
 * @description PDF rendering component using PDF.js with canvas
 * Renders PDF documents page by page with error handling
 *
 * Features:
 * - PDF.js integration for client-side PDF rendering
 * - Page-by-page canvas rendering
 * - Loading progress indication
 * - Error handling with retry option
 * - 1.5x scale for quality/performance balance
 *
 * @component PDFCanvasRenderer
 */

import { useEffect, useRef, useState, memo } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

/**
 * Use the worker copied locally in the public folder
 * Add a timestamp to avoid caching
 */
pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs?v=${Date.now()}`;

/**
 * Props for the PDFCanvasRenderer component
 * @interface PDFCanvasRendererProps
 */
interface PDFCanvasRendererProps {
  /** Blob URL of the PDF to render */
  url: string;
}

/**
 * PDFCanvasRenderer Component
 *
 * Renders a PDF document using PDF.js on HTML5 canvas.
 * Shows loading progress and handles errors gracefully.
 *
 * @param props - Component props
 * @returns The rendered PDF or loading/error state
 */
export const PDFCanvasRenderer = memo(({ url }: PDFCanvasRendererProps) => {
  const [pdf, setPdf] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    console.log("[PDF] Starting to load:", url);

    const loadPdf = async () => {
      try {
        setError(null);

        // Check if the worker is accessible
        try {
          const resp = await fetch(pdfjsLib.GlobalWorkerOptions.workerSrc);
          if (!resp.ok) throw new Error(`Worker status: ${resp.status}`);
          console.log("[PDF] Worker script is accessible");
        } catch (e) {
          console.warn("[PDF] Worker script check failed, attempting load anyway:", e);
        }

        const loadingTask = pdfjsLib.getDocument({
          url,
          cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@5.4.624/cmaps/',
          cMapPacked: true,
          disableRange: true, // Disable range-request for better compatibility
          disableAutoFetch: true,
        });

        loadingTask.onProgress = (progress: { loaded: number; total: number }) => {
          if (progress.total > 0) {
            const percent = Math.round((progress.loaded / progress.total) * 100);
            console.log(`[PDF] Loading progress: ${percent}%`);
          }
        };

        const pdfDoc = await loadingTask.promise;
        console.log("[PDF] Loaded successfully, pages:", pdfDoc.numPages);

        if (isMounted) {
          setPdf(pdfDoc);
          setLoading(false);
        }
      } catch (err: any) {
        console.error("[PDF] Fatal error:", err);
        if (isMounted) {
          setError(`Critical error: ${err.message || 'Rendering engine failed'}`);
          setLoading(false);
        }
      }
    };

    loadPdf();
    return () => { isMounted = false; };
  }, [url]);

  if (error) return (
    <div className="p-12 flex flex-col items-center gap-4 bg-white rounded-xl border border-red-100 max-w-lg text-center">
      <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-xl font-bold">!</div>
      <div className="text-red-600 font-bold">{error}</div>
      <p className="text-gray-400 text-[10px] leading-relaxed">
        The PDF rendering engine could not be initialized. <br/>
        Check that the file is not corrupted or protected.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="mt-2 px-6 py-2 bg-indigo-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all active:scale-95"
      >
        Restart Interface
      </button>
    </div>
  );

  if (loading) return (
    <div className="flex flex-col items-center gap-4 p-20">
      <div className="w-10 h-10 border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin" />
      <div className="text-gray-400 font-black text-[10px] uppercase tracking-[0.2em] animate-pulse">
        Initializing PDF engine...
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-10 p-12 items-center">
      {pdf && Array.from({ length: pdf.numPages }, (_, i) => i + 1).map(pageNo => (
        <PDFPage key={`${url}-${pageNo}`} pdf={pdf} pageNo={pageNo} />
      ))}
    </div>
  );
});

/**
 * Props for the PDFPage component
 * @interface PDFPageProps
 */
interface PDFPageProps {
  /** PDF document object from PDF.js */
  pdf: any;
  /** Page number to render */
  pageNo: number;
}

/**
 * PDFPage Component
 *
 * Renders a single page of a PDF document to a canvas element.
 * Handles cancellation and cleanup properly.
 *
 * @param props - Component props
 * @returns The canvas element with rendered page
 */
const PDFPage = memo(({ pdf, pageNo }: PDFPageProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let renderTask: any = null;

    const renderPage = async () => {
      if (!pdf || !canvasRef.current) return;

      try {
        const page = await pdf.getPage(pageNo);
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        if (!context) return;

        // Scale 1.5 for good quality/performance balance
        const viewport = page.getViewport({ scale: 1.5 });

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport
        };

        renderTask = page.render(renderContext);
        await renderTask.promise;
      } catch (err: any) {
        if (err.name === 'RenderingCancelledException') return;
        console.error("PDF Render error:", err);
      }
    };

    renderPage();
    return () => { if (renderTask) renderTask.cancel(); };
  }, [pdf, pageNo]);

  return (
    <div className="bg-white overflow-hidden border border-gray-100">
      <canvas
        ref={canvasRef}
        className="w-[850px] h-auto block"
      />
    </div>
  );
});

PDFCanvasRenderer.displayName = 'PDFCanvasRenderer';
