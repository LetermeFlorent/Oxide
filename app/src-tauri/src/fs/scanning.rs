
use crate::fs::models::{FileNode, ScanResult};
use crate::scan_dir::{scan_dir, scan_dir_streaming};
use tauri::AppHandle;

#[tauri::command]
pub async fn scan_project_streamed(app: AppHandle, path: String, recursive: Option<bool>) -> Result<(), String> {
    let rec = recursive.unwrap_or(false); let path_c = path.clone();
    tauri::async_runtime::spawn_blocking(move || {
        let mut imgs = Vec::new();
        let _ = scan_dir_streaming(&app, &path_c, &path_c, &mut imgs, rec, 0);
        Ok(())
    }).await.map_err(|e| e.to_string())?
}

#[tauri::command]
pub async fn scan_project(path: String, recursive: Option<bool>) -> Result<ScanResult, String> {
    let rec = recursive.unwrap_or(false);
    tauri::async_runtime::spawn_blocking(move || {
        let mut images = Vec::new();
        let tree = scan_dir(&path, &mut images, rec, 0);
        Ok(ScanResult { tree, images })
    }).await.map_err(|e| e.to_string())?
}

#[tauri::command]
pub async fn index_images(path: String) -> Result<Vec<FileNode>, String> {
    tauri::async_runtime::spawn_blocking(move || {
        let mut images = Vec::new();
        let _ = scan_dir(&path, &mut images, true, 0); Ok(images)
    }).await.map_err(|e| e.to_string())?
}
