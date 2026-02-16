/**
 * @file SplitContent.tsx
 * @description Content display component with split view support for markdown
 * Handles code editing, markdown preview, and binary file display
 * 
 * Features:
 * - Lazy-loaded heavy components (CodeEditor, PDFCanvasRenderer)
 * - Split view mode for markdown (preview + code side-by-side)
 * - Language detection from file extension
 * - Image/PDF preview with zoom support
 * - Resizable panes with draggable handles
 * 
 * @component SplitContent
 * @example
 * <SplitContent 
 *   content={fileContent}
 *   viewMode="split"
 *   isMd={true}
 *   fileName="readme.md"
 * />
 */

import { Monitor, FileCode, Loader2 } from "lucide-react";
import { useResizable } from "../../hooks/useResizable";
import { DraggableHandle } from "../ui/DraggableHandle";
import { memo, useMemo, lazy, Suspense } from "react";
import { useStore } from "../../store/useStore";
import { MarkdownView } from "./SplitContent/MarkdownView";
import { ZoomableContainer } from "../ui/ZoomableContainer";

// Lazy load heavy components to improve initial startup performance
const CodeEditor = lazy(() => import("./SplitContent/CodeEditor").then(module => ({ default: module.CodeEditor })));
const PDFCanvasRenderer = lazy(() => import("./SplitContent/PDFCanvasRenderer").then(module => ({ default: module.PDFCanvasRenderer })));

/**
 * LoadingFallback Component
 * 
 * Spinner displayed while lazy-loaded components are being fetched.
 * 
 * @returns {JSX.Element} Loading spinner interface
 */
const LoadingFallback = () => (
  <div className="flex-1 flex items-center justify-center bg-white">
    <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
  </div>
);

/**
 * SplitContent Component
 * 
 * Main content display area that adapts based on file type and view mode.
 * Supports code editing, markdown preview, and binary file display.
 * 
 * @param {Object} props - Component props
 * @param {string} props.content - The text content to display
 * @param {'preview' | 'code' | 'split'} props.viewMode - Current view mode
 * @param {boolean} props.isMd - Whether the file is markdown
 * @param {boolean} props.isPdf - Whether the file is a PDF
 * @param {string} [props.fileUrl] - Blob URL for binary files
 * @param {string} [props.fileName] - Name of the file for language detection
 * @returns {JSX.Element} The content display interface
 */
export const SplitContent = memo(({ content, viewMode, isMd, isPdf, fileUrl, fileName }: any) => {
  const compactMode = useStore(s => s.compactMode);
  const startH = useResizable('--split-h', true);
  const isSplit = viewMode === 'split' && isMd;
  
  // Detect programming language from file extension
  const language = useMemo(() => {
    if (!fileName) return 'plaintext';
    const ext = fileName.split('.').pop()?.toLowerCase() || 'plaintext';
    const map: any = { 'js': 'javascript', 'ts': 'typescript', 'tsx': 'typescript', 'jsx': 'javascript', 'md': 'markdown', 'json': 'json', 'html': 'html', 'css': 'css', 'py': 'python', 'rs': 'rust' };
    return map[ext] || 'plaintext';
  }, [fileName]);

  // Display binary files (images and PDFs) with zoom support
  if (fileUrl) {
    return (
      <div className={`flex-1 flex flex-col bg-white overflow-hidden border border-gray-100 ${compactMode ? '' : 'rounded-xl'}`}>
        <ZoomableContainer>
          <div className="relative flex flex-col items-center justify-center min-h-full">
            {isPdf ? (
              <Suspense fallback={<LoadingFallback />}>
                <PDFCanvasRenderer url={fileUrl} />
              </Suspense>
            ) : (
              <img src={fileUrl} alt="Preview" className="max-w-full h-auto block" />
            )}
          </div>
        </ZoomableContainer>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Markdown preview pane - shown in preview or split mode */}
      {(isMd && (viewMode === 'preview' || isSplit)) && (
        <div style={isSplit ? { height: 'var(--split-h)' } : { flex: 1 }} className={`flex flex-col bg-white overflow-hidden ${compactMode ? '' : 'rounded-xl'}`}>
          {isSplit && <PaneHeader icon={Monitor} label="PREVIEW" />}
          <MarkdownView content={content} />
        </div>
      )}
      {/* Draggable handle between panes in split mode */}
      {isSplit && <DraggableHandle vertical onMouseDown={startH} />}
      {/* Code editor pane - shown in code or split mode */}
      {(!isMd || viewMode === 'code' || isSplit) && (
        <div className={`flex-1 flex flex-col bg-white overflow-hidden ${compactMode ? '' : 'rounded-xl'}`}>
          {isSplit && <PaneHeader icon={FileCode} label="CODE" />}
          <Suspense fallback={<LoadingFallback />}>
            <CodeEditor content={content} language={language} />
          </Suspense>
        </div>
      )}
    </div>
  );
});

/**
 * PaneHeader Component
 * 
 * Header label for split view panes.
 * 
 * @param {Object} props - Component props
 * @param {React.ComponentType} props.icon - Lucide icon component
 * @param {string} props.label - Header label text
 * @returns {JSX.Element} The pane header
 */
const PaneHeader = memo(({ icon: Icon, label }: any) => (
  <div className="h-7 px-3 flex items-center gap-2 bg-gray-50/50 border-b border-gray-100 shrink-0">
    <Icon size={10} className="text-blue-500" />
    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
  </div>
));
