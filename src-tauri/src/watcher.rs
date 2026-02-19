use notify::{Watcher, RecursiveMode, Config, RecommendedWatcher, Event};
use std::path::Path;
use tauri::{AppHandle, Manager, Emitter};
use crate::state::AppState;

#[tauri::command]
pub fn watch_project(app: AppHandle, id: String, path: String) -> Result<(), String> {
    let state = app.state::<AppState>();
    let app_clone = app.clone();
    let id_clone = id.clone();
    
    let mut watcher = RecommendedWatcher::new(move |res: notify::Result<Event>| {
        if let Ok(event) = res {
            let paths: Vec<String> = event.paths.iter()
                .map(|p| p.to_string_lossy().to_string())
                .collect();
            
            if !paths.is_empty() {
                let _ = app_clone.emit(&format!("fs-change-{}", id_clone), paths);
            }
        }
    }, Config::default()).map_err(|e| e.to_string())?;

    // Initial watch is NonRecursive (root only)
    watcher.watch(Path::new(&path), RecursiveMode::NonRecursive).map_err(|e| e.to_string())?;
    
    state.watchers.lock().unwrap().insert(id, (Box::new(watcher), vec![path]));
    Ok(())
}

#[tauri::command]
pub fn watch_folder(state: tauri::State<'_, AppState>, id: String, path: String) -> Result<(), String> {
    let mut watchers = state.watchers.lock().unwrap();
    if let Some((watcher, paths)) = watchers.get_mut(&id) {
        if !paths.contains(&path) {
            watcher.watch(Path::new(&path), RecursiveMode::NonRecursive).map_err(|e| e.to_string())?;
            paths.push(path);
        }
    }
    Ok(())
}

#[tauri::command]
pub fn unwatch_folder(state: tauri::State<'_, AppState>, id: String, path: String) -> Result<(), String> {
    let mut watchers = state.watchers.lock().unwrap();
    if let Some((watcher, paths)) = watchers.get_mut(&id) {
        if let Some(pos) = paths.iter().position(|p| p == &path) {
            let _ = watcher.unwatch(Path::new(&path));
            paths.remove(pos);
        }
    }
    Ok(())
}

#[tauri::command]
pub fn unwatch_project(state: tauri::State<'_, AppState>, id: String) -> Result<(), String> {
    state.watchers.lock().unwrap().remove(&id);
    Ok(())
}
