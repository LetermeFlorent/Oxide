
use crate::state::AppState;
use notify::{Config, Event, RecommendedWatcher, RecursiveMode, Watcher};
use std::path::Path;
use tauri::{AppHandle, Emitter, Manager};

#[tauri::command]
pub fn watch_project(app: AppHandle, id: String, path: String) -> Result<(), String> {
    let state = app.state::<AppState>();
    let app_c = app.clone(); let id_c = id.clone();
    let mut w = RecommendedWatcher::new(move |res: notify::Result<Event>| {
        if let Ok(event) = res {
            let paths: Vec<String> = event.paths.iter().map(|p| p.to_string_lossy().to_string()).collect();
            if !paths.is_empty() { let _ = app_c.emit(&format!("fs-change-{}", id_c), paths); }
        }
    }, Config::default()).map_err(|e| e.to_string())?;

    w.watch(Path::new(&path), RecursiveMode::NonRecursive).map_err(|e| e.to_string())?;
    state.watchers.lock().unwrap().insert(id, (Box::new(w), vec![path]));
    Ok(())
}

#[tauri::command]
pub fn unwatch_project(state: tauri::State<'_, AppState>, id: String) -> Result<(), String> {
    state.watchers.lock().unwrap().remove(&id); Ok(())
}
