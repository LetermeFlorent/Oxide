
use crate::state::AppState;
use notify::RecursiveMode;
use std::path::Path;

#[tauri::command]
pub fn watch_folder(state: tauri::State<'_, AppState>, id: String, path: String) -> Result<(), String> {
    let mut w_map = state.watchers.lock().unwrap();
    if let Some((w, paths)) = w_map.get_mut(&id) {
        if !paths.contains(&path) {
            w.watch(Path::new(&path), RecursiveMode::NonRecursive).map_err(|e| e.to_string())?;
            paths.push(path);
        }
    }
    Ok(())
}

#[tauri::command]
pub fn unwatch_folder(state: tauri::State<'_, AppState>, id: String, path: String) -> Result<(), String> {
    let mut w_map = state.watchers.lock().unwrap();
    if let Some((w, paths)) = w_map.get_mut(&id) {
        if let Some(pos) = paths.iter().position(|p| p == &path) {
            let _ = w.unwatch(Path::new(&path)); paths.remove(pos);
        }
    }
    Ok(())
}
