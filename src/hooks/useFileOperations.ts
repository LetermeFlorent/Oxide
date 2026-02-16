/**
 * @file useFileOperations.ts
 * @description Custom hook for handling file system operations
 * Manages file opening, content loading, and project tree updates
 * 
 * Features:
 * - File type detection and specialized handling
 * - Binary/archive file blocking for stability
 * - Image/PDF blob generation for preview
 * - Large file protection (>1MB)
 * - Task progress calculation for markdown files
 * 
 * @hook useFileOperations
 * @example
 * const { onFile } = useFileOperations();
 * onFile(fileEntry);
 */

import { useCallback } from "react";
import { readDir, stat, readFile, readTextFile } from "@tauri-apps/plugin-fs";
import { invoke } from "@tauri-apps/api/core";
import { useStore } from "../store/useStore";
import { calculateTaskProgress } from "../utils/mdUtils";

/**
 * useFileOperations Hook
 * 
 * Provides file operation handlers integrated with the global store.
 * Automatically manages file loading, preview generation, and project state updates.
 * 
 * @returns {Object} Object containing file operation handlers
 * @returns {Function} returns.onFile - Handler for opening/loading a file
 */
export function useFileOperations() {
  // Access global store state and actions
  const activeProjectId = useStore(s => s.activeProjectId);
  const projects = useStore(s => s.projects);
  const activeProject = projects.find(p => p.id === activeProjectId);
  const updateActiveProject = useStore(s => s.updateActiveProject);
  const updateProjectTree = useStore(s => s.updateProjectTree);

  /**
   * Handle file/folder click events
   * Routes to appropriate handler based on file type:
   * - Folders: Lazy-load children if not already loaded
   * - Archives/Binaries: Block with warning message
   * - Images/PDFs: Load as blob for preview
   * - Text files: Read content with size limits
   * 
   * @param {any} f - File entry object from file tree
   * @param {string} f.path - Absolute file path
   * @param {string} f.name - File name
   * @param {boolean} f.isFolder - Whether entry is a directory
   * @param {any[]} [f.children] - Child entries (for folders)
   */
  const onFile = useCallback(async (f: any) => {
    // Guard: Don't proceed if no active project
    if (!activeProjectId) return;
    
    try {
      // Handle folder expansion
      if (f.isFolder) {
        // Only load children if not already loaded
        if (!f.children?.length) {
          const res = await invoke<any>("scan_project", { path: f.path, recursive: false });
          f.children = res.tree;
          updateProjectTree(activeProjectId, [...activeProject!.tree]);
        }
      } else {
        // Extract file extension for type detection
        const ext = f.name.split('.').pop()?.toLowerCase() || '';
        
        // List of binary/archive extensions that could crash the editor
        const binaryExtensions = ['zip', 'rar', '7z', 'tar', 'gz', 'xz', 'exe', 'bin', 'iso', 'dmg'];

        // 1. Block known archives to prevent memory crashes
        if (binaryExtensions.includes(ext)) {
          updateActiveProject({ 
            selectedFile: f, 
            fileContent: `⚠️ Archive or binary format (.${ext}) detected.\n\nPreview is disabled for this file type to preserve system stability.`, 
            fileUrl: null 
          });
          return;
        }

        // 2. Handle images and PDFs
        // Load binary data and create blob URL for preview
        if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'pdf'].includes(ext)) {
          const bytes = await readFile(f.path);
          let mime = `image/${ext === 'svg' ? 'svg+xml' : ext}`;
          if (ext === 'pdf') mime = 'application/pdf';
          const blob = new Blob([bytes], { type: mime });
          updateActiveProject({ selectedFile: f, fileContent: "", fileUrl: URL.createObjectURL(blob) });
          return;
        }

        // 3. Text file handling (Code, MD, etc.)
        const s = await stat(f.path);
        
        // Large file protection: Only read first 10KB of files > 1MB
        if (s.size > 1024 * 1024) { // > 1MB
          // For large text files, read a portion of the bytes
          const bytes = await readFile(f.path);
          const portion = bytes.slice(0, 10000);
          const content = new TextDecoder().decode(portion);
          updateActiveProject({ 
            selectedFile: f, 
            fileContent: `⚠️ Large file (${(s.size/1024/1024).toFixed(1)} MB). Limited preview:\n\n${content}`, 
            fileUrl: null 
          });
        } else {
          // Normal size file: Read complete content
          const content = await readTextFile(f.path);
          const updates: any = { selectedFile: f, fileContent: content, fileUrl: null };
          
          // Calculate task progress if this is the followed file
          if (activeProject?.followedFilePath === f.path) {
            updates.taskProgress = calculateTaskProgress(content);
          }
          
          updateActiveProject(updates);
        }
      }
    } catch (e) { 
      // Log error and show user-friendly error message
      console.error("[FS] Error opening file:", e);
      updateActiveProject({ selectedFile: f, fileContent: "❌ Error: Unable to read file.", fileUrl: null });
    }
  }, [activeProjectId, activeProject, updateActiveProject, updateProjectTree]);

  // Expose file operation handlers
  return { onFile };
}
