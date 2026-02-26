
use std::fs;
use std::io::Write;

#[tauri::command]
pub async fn read_text_file(path: String) -> Result<String, String> {
    fs::read_to_string(path).map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn write_text_file(path: String, content: String) -> Result<(), String> {
    fs::write(path, content).map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn rename_entry(path: String, new_name: String) -> Result<String, String> {
    let old = std::path::Path::new(&path);
    let new = old.parent().ok_or("Invalid path")?.join(new_name);
    fs::rename(&path, &new).map_err(|e| e.to_string())?;
    Ok(new.to_string_lossy().to_string())
}

#[tauri::command]
pub async fn delete_entry(path: String) -> Result<(), String> {
    let meta = fs::metadata(&path).map_err(|e| e.to_string())?;
    if meta.is_dir() { fs::remove_dir_all(path) } else { fs::remove_file(path) }.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn log_to_file(message: String) -> Result<(), String> {
    let mut f = fs::OpenOptions::new().create(true).append(true).open("oxide_debug.log").map_err(|e| e.to_string())?;
    writeln!(f, "[{}] {}", chrono::Local::now().format("%Y-%m-%d %H:%M:%S"), message).map_err(|e| e.to_string())
}
