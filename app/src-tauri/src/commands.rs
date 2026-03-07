
use crate::*;

pub fn register() -> impl Fn(tauri::ipc::Invoke<tauri::Wry>) -> bool {
    tauri::generate_handler![
        setup::spawn_pty, pty::io::write_to_pty, pty::io::write_to_all_ptys,
        pty::management::resize_pty, pty::management::close_pty, pty::management::set_pty_visibility,
        pty::io::get_pty_buffer, pty::io::clear_pty_buffer, fs::scanning::scan_project, fs::scanning::scan_project_streamed,
        fs::scanning::index_images, fs::operations::rename_entry, fs::operations::delete_entry, fs::operations::log_to_file,
        fs::operations::read_text_file, fs::operations::write_text_file, fs::create_dir, fs::get_file_size,
        search::commands::search_in_projects, watcher::commands::watch_project, watcher::folders::watch_folder,
        watcher::folders::unwatch_folder, watcher::commands::unwatch_project, workspace::save_workspace,
        diff::commands::sync_dir,
        binary::commands::scan_project_binary, mmap_viewer::read_file_mmap,
        lsm::commands::index_project_lsm, lsm::commands::list_folder_lsm, plugin_system::execute_wasm_plugin
    ]
}
