
pub mod models;
pub mod operations;
pub mod scanning;

pub use models::{FileNode, FilePatch, ScanResult};
pub use operations::{read_text_file, write_text_file, rename_entry, delete_entry, log_to_file};
pub use scanning::{scan_project, scan_project_streamed, index_images};

#[tauri::command]
pub async fn create_dir(path: String) -> Result<(), String> {
    std::fs::create_dir_all(path).map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn get_file_size(path: String) -> Result<u64, String> {
    std::fs::metadata(path).map_err(|e| e.to_string()).map(|m| m.len())
}
