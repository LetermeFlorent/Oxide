/**
 * @file MarkdownView.tsx
 * @description Markdown rendering component with GFM and raw HTML support
 * Renders markdown content with GitHub-flavored markdown features
 *
 * Features:
 * - GitHub-flavored markdown support (tables, strikethrough, etc.)
 * - Raw HTML rendering for embedded content
 * - Custom prose styling for consistent appearance
 * - Scrollable content area
 *
 * @component MarkdownView
 */

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { memo } from "react";

/**
 * Props for the MarkdownView component
 * @interface MarkdownViewProps
 */
interface MarkdownViewProps {
  /** Markdown content to render */
  content: string;
}

/**
 * MarkdownView Component
 *
 * Renders markdown content with support for GitHub-flavored markdown
 * and raw HTML. Uses a custom prose style for consistent appearance.
 *
 * @param props - Component props
 * @returns The rendered markdown content
 */
export const MarkdownView = memo(({ content }: MarkdownViewProps) => (
  <div className="flex-1 p-8 overflow-auto prose-oxide scrollbar-modern-thin bg-white h-full">
    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
      {content}
    </ReactMarkdown>
  </div>
));
