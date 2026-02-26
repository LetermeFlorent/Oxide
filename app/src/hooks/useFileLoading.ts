import { useCallback } from "react";
import { readFile } from "@tauri-apps/plugin-fs";
import { useStore } from "../store/useStore";
import { isBinaryFile, getFileExtension } from "../utils/file/fileTypeUtils";
import { useSyncFileProgress } from "./useSyncFileProgress";
import { useOxideCommand } from "./useOxideCommand";

export function useFileLoading() {
  const updateActiveProject = useStore(s => s.updateActiveProject);
  const syncProgress = useSyncFileProgress();
  const execute = useOxideCommand();

  return useCallback(async (f: any) => {
    const { path, name } = f;
    if (isBinaryFile(name)) {
      const bytes = await readFile(path);
      const ext = getFileExtension(name);
      const mime = ext === 'pdf' ? 'application/pdf' : `image/${ext === 'svg' ? 'svg+xml' : ext}`;
      const url = URL.createObjectURL(new Blob([bytes], { type: mime }));
      updateActiveProject({ selectedFile: f, fileContent: "", fileUrl: url });
      return;
    }

    const size = await execute<number>("get_file_size", { path });
    if (size !== null && size > 2 * 1024 * 1024) {
      const res = await execute<any>("read_file_mmap", { path, offset: 0, length: 50000 });
      if (res) updateActiveProject({ selectedFile: f, fileContent: res.content, fileUrl: null });
    } else {
      const content = await execute<string>("read_text_file", { path });
      if (content !== null) {
        updateActiveProject({ selectedFile: f, fileContent: content, fileUrl: null });
        syncProgress(path, content);
      }
    }
  }, [updateActiveProject, syncProgress, execute]);
}
