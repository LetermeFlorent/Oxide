pub mod db;
pub mod db_setup;
pub mod diff;
pub mod fs;
pub mod scan_dir;
pub mod search;
pub mod watcher;
pub mod workspace;
pub mod pty;
pub mod state;
pub mod pty_commands;
pub mod spawn_pty;
pub mod binary_tree;
pub mod mmap_viewer;
pub mod lsm_index;
pub mod plugin_system;

use crate::state::AppState;
use portable_pty::NativePtySystem;
use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let app_dir = app.path().app_data_dir().unwrap();
            std::fs::create_dir_all(&app_dir).unwrap();
            
            // Legacy SQLite setup
            let conn = db_setup::init_db(&app_dir).expect("failed to init db");
            
            // New LSM Sled setup
            let sled_path = app_dir.join("oxide_lsm_v2");
            let lsm_db = sled::open(sled_path).expect("failed to init sled db");
            
            app.manage(AppState {
                sessions: Arc::new(Mutex::new(HashMap::new())),
                pty_system: NativePtySystem::default(),
                watchers: Arc::new(Mutex::new(HashMap::new())),
                lsm_db: Arc::new(Mutex::new(Some(lsm_db))),
                db: Arc::new(Mutex::new(conn)),
            });
            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            spawn_pty::spawn_pty, pty_commands::write_to_pty, pty_commands::resize_pty,
            pty_commands::close_pty, pty_commands::set_pty_visibility,
            fs::scan_project, fs::scan_project_streamed, fs::index_images, search::search_in_projects, watcher::watch_project,
            watcher::watch_folder, watcher::unwatch_folder,
            watcher::unwatch_project, workspace::save_workspace,
            db::list_folder_from_db, db::index_project_db, diff::sync_dir,
            binary_tree::scan_project_binary,
            mmap_viewer::read_file_mmap,
            lsm_index::index_project_lsm,
            lsm_index::list_folder_lsm,
            plugin_system::execute_wasm_plugin,
            fs::rename_entry, fs::delete_entry, fs::log_to_file,
            fs::read_text_file, fs::write_text_file, fs::create_dir,
            fs::get_file_size
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
