
pub mod binary;
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
    println!("[INFO] Starting Oxide Core...");
    tauri::Builder::default()
        .setup(|app| { 
            println!("[INFO] Running setup...");
            setup::init(app).map_err(|e| {
                eprintln!("[ERROR] Setup failed: {}", e);
                e.into()
            }) 
        })
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(commands::register())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
