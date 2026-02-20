use memmap2::Mmap;
use serde::Serialize;
use std::fs::File;

#[derive(Serialize)]
pub struct MmapPreview {
    pub content: String,
    pub size: u64,
    pub is_binary: bool,
    pub truncated: bool,
}

#[tauri::command]
pub async fn read_file_mmap(
    path: String,
    offset: u64,
    length: usize,
) -> Result<MmapPreview, String> {
    tauri::async_runtime::spawn_blocking(move || {
        let file = File::open(&path).map_err(|e| e.to_string())?;
        let metadata = file.metadata().map_err(|e| e.to_string())?;
        let size = metadata.len();

        let mmap = unsafe { Mmap::map(&file).map_err(|e| e.to_string())? };

        let start = offset.min(size) as usize;
        let end = (offset + length as u64).min(size) as usize;
        let chunk = &mmap[start..end];

        // Basic heuristic for binary detection
        let is_binary = chunk.iter().take(1024).any(|&b| b == 0);

        let content = if is_binary {
            "Binary content detected. Preview unavailable.".to_string()
        } else {
            String::from_utf8_lossy(chunk).to_string()
        };

        Ok(MmapPreview {
            content,
            size,
            is_binary,
            truncated: size > (offset + length as u64),
        })
    })
    .await
    .map_err(|e| e.to_string())?
}
