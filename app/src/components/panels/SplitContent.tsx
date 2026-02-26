
import { Monitor, FileCode } from "lucide-react";
import { ResizeHandle } from "../ui/ResizeHandle";
import { memo, lazy, Suspense } from "react";
import { MarkdownView } from "./SplitContent/MarkdownView";
import { BinaryViewer, PaneHeader, LoadingFallback, useSplitContent } from "./SplitContent/index";

const CodeEditor = lazy(() => import("./SplitContent/CodeEditor").then(m => ({ default: m.CodeEditor })));

export const SplitContent = memo(({ content, viewMode, isMd, isPdf, fileUrl, fileName }: any) => {
  const { startH, isSplit, language } = useSplitContent(fileName, viewMode, isMd);
  if (fileUrl) return <BinaryViewer url={fileUrl} isPdf={isPdf} />;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {(isMd && (viewMode === 'preview' || isSplit)) && (
        <div style={isSplit ? { height: 'var(--split-h)' } : { flex: 1 }} className="flex flex-col min-h-0 relative">
          {isSplit && <PaneHeader icon={Monitor} label="PREVIEW" />}
          <MarkdownView content={content} />
        </div>
      )}
      {isSplit && <ResizeHandle vertical onMouseDown={startH} />}
      {(!isMd || viewMode === 'code' || isSplit) && (
        <div className="flex-1 flex flex-col min-h-0 relative">
          {isSplit && <PaneHeader icon={FileCode} label="CODE" />}
          <Suspense fallback={<LoadingFallback />}>
            <CodeEditor content={content} language={language} />
          </Suspense>
        </div>
      )}
    </div>
  );
});

SplitContent.displayName = 'SplitContent';
