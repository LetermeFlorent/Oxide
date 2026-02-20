import { useCallback } from "react";
import { readFile } from "@tauri-apps/plugin-fs";
import { useStore } from "../store/useStore";
import { calculateTaskProgress } from "../utils/mdUtils";
import { monitoredInvoke } from "../utils/performance";

export function useFileLoading() {
  const updateActiveProject = useStore(s => s.updateActiveProject);

  return useCallback(async (f: any) => {
    const { path, name } = f;
    if (!name) console.log("[useFileLoading] Attempting to load file with EMPTY name at:", path);
    console.log("[useFileLoading] Attempting to load:", path, " (Name:", name, ")");
    try {
      const ext = name.includes('.') ? name.split('.').pop()?.toLowerCase() || '' : '';
      const isImageOrPdf = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'pdf'].includes(ext);
      
      // Treat files starting with dot as text regardless of their perceived extension
      const isDotfile = name.startsWith('.');
      console.log("[useFileLoading] isDotfile:", isDotfile, "isImageOrPdf:", isImageOrPdf);

      if (!isDotfile && isImageOrPdf) {
        console.log("[useFileLoading] Loading as binary (image/pdf)");
        const bytes = await readFile(path);
        const mime = ext === 'pdf' ? 'application/pdf' : `image/${ext === 'svg' ? 'svg+xml' : ext}`;
        const url = URL.createObjectURL(new Blob([bytes], { type: mime }));
        console.log("[useFileLoading] Binary loaded, URL created");
        updateActiveProject({ selectedFile: f, fileContent: "", fileUrl: url });
        return;
      }

      console.log("[useFileLoading] Getting file size via Rust:", path);
      const size = await monitoredInvoke<number>("get_file_size", { path });
      console.log("[useFileLoading] File size:", size);
      if (size > 2 * 1024 * 1024) {
        console.log("[useFileLoading] Large file detected, using mmap");
        const res = await monitoredInvoke<any>("read_file_mmap", { path, offset: 0, length: 50000 });
        updateActiveProject({ selectedFile: f, fileContent: res.content, fileUrl: null });
      } else {
        console.log("[useFileLoading] Reading text file via Rust command:", path);
        const content = await monitoredInvoke<string>("read_text_file", { path });
        console.log("[useFileLoading] Text file read, content length:", content.length);
        const activeProject = useStore.getState().projects.find(p => p.id === useStore.getState().activeProjectId);
        const updates: any = { selectedFile: f, fileContent: content, fileUrl: null };
        if (activeProject?.followedFilePath === path) {
          console.log("[useFileLoading] Calculating task progress for followed file");
          updates.taskProgress = calculateTaskProgress(content);
        }
        updateActiveProject(updates);
        console.log("[useFileLoading] Store updated with new file");
      }
    } catch (err) {
      console.error("[useFileLoading] Failed to load file:", path, err);
    }
  }, [updateActiveProject]);
}
