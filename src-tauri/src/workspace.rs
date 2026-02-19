use std::fs;
use std::thread;

#[tauri::command]
pub fn save_workspace(state_json: String) -> Result<(), String> {
    thread::spawn(move || {
        let path = std::env::temp_dir().join("oxide_workspace_state.json");
        let _ = fs::write(path, state_json);
    });
    Ok(())
}
