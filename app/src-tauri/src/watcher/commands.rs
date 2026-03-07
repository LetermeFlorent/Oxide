
use crate::state::AppState;
use notify::{Config, Event, RecommendedWatcher, RecursiveMode, Watcher};
use std::path::Path;
use std::sync::mpsc::channel;
use std::thread;
use std::time::Duration;
use std::collections::HashSet;
use tauri::{AppHandle, Emitter, Manager};

#[tauri::command]
pub fn watch_project(app: AppHandle, id: String, path: String) -> Result<(), String> {
    let state = app.state::<AppState>();
    let app_c = app.clone(); 
    let id_c = id.clone();
    
    // Create a channel for debouncing
    let (tx, rx) = channel::<String>();
    
    // Spawning a debouncer thread for this project
    thread::spawn(move || {
        let mut paths = HashSet::new();
        loop {
            // Wait for first event
            if let Ok(path) = rx.recv() {
                paths.insert(path);
                
                // Debounce window (100ms)
                loop {
                    match rx.recv_timeout(Duration::from_millis(100)) {
                        Ok(p) => { paths.insert(p); }
                        Err(_) => break, // Timeout reached, emit collected paths
                    }
                }
                
                if !paths.is_empty() {
                    let collected: Vec<String> = paths.drain().collect();
                    let _ = app_c.emit(&format!("fs-change-{}", id_c), collected);
                }
            } else {
                break; // Channel closed
            }
        }
    });

    let mut w = RecommendedWatcher::new(move |res: notify::Result<Event>| {
        if let Ok(event) = res {
            for p in event.paths {
                let _ = tx.send(p.to_string_lossy().to_string());
            }
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
