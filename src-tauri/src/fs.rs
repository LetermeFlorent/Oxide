use serde::{Deserialize, Serialize};
use crate::scan_dir::{scan_dir, scan_dir_streaming};
use tauri::AppHandle;
use bincode::{Encode, Decode};
use std::fs;

#[derive(Debug, Serialize, Deserialize, Clone, Encode, Decode)]
pub struct FilePatch {
    pub project_id: String,
    pub parent_path: String,
    pub added: Vec<FileNode>,
    pub removed: Vec<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone, Encode, Decode)]
pub struct FileNode {
  pub name: String,
  pub path: String,
  #[serde(rename = "isFolder")]
  pub is_folder: bool,
  pub children: Option<Vec<FileNode>>,
}

#[derive(Debug, Serialize, Deserialize, Encode, Decode)]
pub struct ScanResult {
    pub tree: Vec<FileNode>,
    pub images: Vec<FileNode>,
}

use std::io::Write;

#[tauri::command]
pub async fn log_to_file(message: String) -> Result<(), String> {
    let mut file = fs::OpenOptions::new()
        .create(true)
        .append(true)
        .open("oxide_debug.log")
        .map_err(|e| e.to_string())?;
    
    let timestamp = chrono::Local::now().format("%Y-%m-%d %H:%M:%S");
    writeln!(file, "[{}] {}", timestamp, message).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub async fn get_file_size(path: String) -> Result<u64, String> {
    let metadata = fs::metadata(path).map_err(|e| e.to_string())?;
    Ok(metadata.len())
}

#[tauri::command]
pub async fn read_text_file(path: String) -> Result<String, String> {
    fs::read_to_string(path).map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn write_text_file(path: String, content: String) -> Result<(), String> {
    fs::write(path, content).map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn create_dir(path: String) -> Result<(), String> {
    fs::create_dir_all(path).map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn rename_entry(path: String, new_name: String) -> Result<String, String> {
    let old_path = std::path::Path::new(&path);
    let parent = old_path.parent().ok_or("Invalid path")?;
    let new_path = parent.join(new_name);
    fs::rename(&path, &new_path).map_err(|e| e.to_string())?;
    Ok(new_path.to_string_lossy().to_string())
}

#[tauri::command]
pub async fn delete_entry(path: String) -> Result<(), String> {
    let metadata = fs::metadata(&path).map_err(|e| e.to_string())?;
    if metadata.is_dir() {
        fs::remove_dir_all(path).map_err(|e| e.to_string())?;
    } else {
        fs::remove_file(path).map_err(|e| e.to_string())?;
    }
    Ok(())
}

#[tauri::command]
pub async fn scan_project_streamed(app: AppHandle, path: String, recursive: Option<bool>) -> Result<(), String> {
    let rec = recursive.unwrap_or(false);
    let path_clone = path.clone();
    tauri::async_runtime::spawn_blocking(move || {
        let mut images = Vec::new();
        let _ = scan_dir_streaming(&app, &path_clone, &path_clone, &mut images, rec, 0);
        Ok(())
    }).await.map_err(|e| e.to_string())?
}

#[tauri::command]
pub async fn index_images(path: String) -> Result<Vec<FileNode>, String> {
    tauri::async_runtime::spawn_blocking(move || {
        let mut images = Vec::new();
        // We call scan_dir with recursive=true but discard the tree
        let _ = scan_dir(&path, &mut images, true, 0);
        Ok(images)
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
