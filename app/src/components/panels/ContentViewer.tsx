
import { SplitContent } from "./SplitContent";
import { memo } from "react";
import { useContentViewer } from "./ContentViewer/useContentViewer";
import { ContentViewerEmpty } from "./ContentViewer/ContentViewerEmpty";
import { ContentViewerHeader } from "./ContentViewer/ContentViewerHeader";

export const ContentViewer = memo(({ content, fileName, fileUrl }: any) => {
  const s = useContentViewer(content, fileName);
  if (!fileName && !fileUrl) return <ContentViewerEmpty />;

  return (
    <div className="flex-1 flex flex-col overflow-hidden min-w-0 bg-panel-bg rounded-xl">
      <ContentViewerHeader s={s} fileName={fileName} />
      <SplitContent content={content} viewMode={s.viewMode} isMd={s.isMd} isPdf={s.isPdf} fileUrl={fileUrl} fileName={fileName} />
    </div>
  );
}, (p, n) => p.content === n.content && p.fileName === n.fileName && p.fileUrl === n.fileUrl);

ContentViewer.displayName = 'ContentViewer';
