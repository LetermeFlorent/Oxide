
pub mod binary;
pub mod db;
pub mod diff;
pub mod fs;
pub mod lsm;
pub mod mmap_viewer;
pub mod plugin_system;
pub mod pty;
pub mod scan_dir;
pub mod search;
pub mod state;
pub mod watcher;
pub mod workspace;
pub mod setup;
pub mod commands;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| { setup::init(app).map_err(|e| e.into()) })
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(commands::register())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
