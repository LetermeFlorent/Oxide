
use crate::state::AppState;
use crate::{db, pty};
use std::sync::{Arc, Mutex};
use tauri::{App, Manager, AppHandle};

pub fn init(app: &mut App) -> Result<(), Box<dyn std::error::Error>> {
    let dir = app.path().app_data_dir().unwrap_or_else(|_| {
        std::env::current_dir().unwrap_or_default().join("oxide_data")
    });
    let _ = std::fs::create_dir_all(&dir);
    
    // Attempt to open DBs gracefully
    let conn = db::init_db(&dir).unwrap_or_else(|e| {
        eprintln!("[ERROR] SQLite init failed: {}", e);
        rusqlite::Connection::open_in_memory().unwrap()
    });
    
    let sled = sled::open(dir.join("oxide_lsm_v3")).ok();
    if sled.is_none() { eprintln!("[WARNING] Sled LSM DB could not be opened (lock active?)."); }

    app.manage(AppState {
        sessions: Arc::new(Mutex::new(std::collections::HashMap::new())),
        pty_system: portable_pty::NativePtySystem::default(),
        watchers: Arc::new(Mutex::new(std::collections::HashMap::new())),
        lsm_db: Arc::new(Mutex::new(sled)),
        db: Arc::new(Mutex::new(conn)),
    });
    Ok(())
}

#[tauri::command]
pub fn spawn_pty(app: AppHandle, id: String, cwd: Option<String>, rows: u16, cols: u16) -> Result<bool, String> {
    let state = app.state::<AppState>();
    if state.sessions.lock().unwrap().contains_key(&id) { return Ok(false); }
    let (m, ch) = pty::spawner::create_pty(&state.pty_system, rows, cols, cwd)?;
    let reader = m.try_clone_reader().map_err(|e| e.to_string())?;
    let writer = m.take_writer().map_err(|e| e.to_string())?;
    let vis = Arc::new(Mutex::new(false));
    let buf = Arc::new(Mutex::new(Vec::with_capacity(8192)));
    state.sessions.lock().unwrap().insert(id.clone(), pty::models::PtySession { writer, master: m, child: ch, is_visible: vis.clone(), buffer: buf.clone() });
    pty::reader::spawn_reader(app, id, reader, vis, buf);
    Ok(true)
}
