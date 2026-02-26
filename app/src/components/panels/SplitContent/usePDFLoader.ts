
import { useState, useEffect } from "react";
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs?v=${Date.now()}`;

export function usePDFLoader(url: string) {
  const [pdf, setPdf] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true; setLoading(true); setError(null);
    const load = async () => {
      try {
        const task = pdfjsLib.getDocument({ url, cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@5.4.624/cmaps/', cMapPacked: true, disableRange: true, disableAutoFetch: true });
        const doc = await task.promise;
        if (mounted) { setPdf(doc); setLoading(false); }
      } catch (err: any) {
        if (mounted) { setError(err.message || 'PDF Load failed'); setLoading(false); }
      }
    };
    load();
    return () => { mounted = false; };
  }, [url]);

  return { pdf, error, loading };
}
