/**
 * @file MarkdownPreview.tsx
 * @description Simple markdown preview component with GitHub-flavored markdown support
 * Renders markdown content using react-markdown with GFM plugin
 * 
 * Features:
 * - GitHub-flavored markdown support (tables, strikethrough, etc.)
 * - Custom prose styling for consistent appearance
 * - Scrollable content area with modern scrollbar
 * - File name display in header
 * 
 * @component MarkdownPreview
 * @example
 * <MarkdownPreview content="# Hello World" fileName="readme.md" />
 */

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Monitor } from "lucide-react";
import { memo } from "react";

/**
 * MarkdownPreview Component
 * 
 * Renders markdown content with GFM support in a styled container.
 * Provides a clean preview interface with file identification.
 * 
 * @param {Object} props - Component props
 * @param {string} props.content - The markdown content to render
 * @param {string} [props.fileName] - Optional file name to display in header
 * @returns {JSX.Element} The markdown preview interface
 */
export const MarkdownPreview = memo(({ content, fileName }: { content: string, fileName?: string }) => (
  <div className="flex-1 flex flex-col bg-white rounded-xl overflow-hidden">
    <div className="h-8 px-3 flex items-center bg-gray-50/50 border-b border-gray-100">
      <Monitor size={12} className="text-gray-400 mr-2" />
      <span className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Preview {fileName}</span>
    </div>
    <div className="flex-1 p-6 overflow-auto scrollbar-modern selection:bg-gray-50">
      <div className="prose-custom max-w-2xl mx-auto">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>
    </div>
  </div>
));

MarkdownPreview.displayName = 'MarkdownPreview';
