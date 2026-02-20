/**
 * @file mdUtils.ts
 * @description Markdown utility functions for task progress tracking
 * Provides helpers for parsing markdown task lists and calculating completion
 * 
 * Features:
 * - Task progress calculation from markdown checkboxes
 * - Task existence detection in markdown content
 * - Recursive markdown file discovery
 * 
 * @module utils/mdUtils
 */

import { FileEntry } from "../store/types";

/**
 * Calculates task completion percentage from markdown content
 * Parses GitHub-style task lists: - [ ] incomplete, - [x] complete
 * 
 * @param content - Markdown content to analyze
 * @returns Completion percentage (0-100) or null if no tasks found
 * @example
 * calculateTaskProgress("- [x] Done\n- [ ] Todo") // returns 50
 */
export const calculateTaskProgress = (content: string): number | null => {
  const lines = content.split('\n');
  let totalTasks = 0;
  let completedTasks = 0;

  // Pattern for [ ] (not done) and [x] (done)
  const taskPattern = /^\s*[-*+]\s+\[( |x|X)\]/;
  const completedPattern = /^\s*[-*+]\s+\[(x|X)\]/;

  for (const line of lines) {
    if (taskPattern.test(line)) {
      totalTasks++;
      if (completedPattern.test(line)) {
        completedTasks++;
      }
    }
  }

  if (totalTasks === 0) return null;
  return Math.round((completedTasks / totalTasks) * 100);
};

/**
 * Checks if markdown content contains any task checkboxes
 * 
 * @param content - Markdown content to check
 * @returns True if the content contains at least one task
 */
export const hasTasks = (content: string): boolean => {
  const taskPattern = /^\s*[-*+]\s+\[( |x|X)\]/m;
  return taskPattern.test(content);
};

/**
 * Recursively finds all markdown files in a file tree
 * 
 * @param entries - Root file entries to search
 * @returns Array of paths to markdown files
 */
export const findMarkdownFiles = (entries: FileEntry[]): string[] => {
  const files: string[] = [];
  const scan = (items: FileEntry[]) => {
    for (const item of items) {
      if (item.isFolder && item.children) scan(item.children);
      else if (!item.isFolder && item.name.toLowerCase().endsWith('.md')) {
        files.push(item.path);
      }
    }
  };
  scan(entries);
  return files;
};
