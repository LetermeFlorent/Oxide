use crate::db_setup::index_project_in_db;
use crate::fs::FileNode;
use crate::state::AppState;
use rusqlite::{params, Result};
use std::sync::{Arc, Mutex};

pub fn get_children_from_db(
    db: Arc<Mutex<rusqlite::Connection>>,
    parent_path: &str,
) -> Result<Vec<FileNode>> {
    let conn = db.lock().unwrap();
    let mut stmt = conn.prepare("SELECT name, path, is_folder FROM files WHERE parent_path = ? ORDER BY is_folder DESC, name ASC")?;
    let rows = stmt.query_map(params![parent_path], |row| {
        let is_dir = row.get::<_, i32>(2)? == 1;
        Ok(FileNode {
            name: row.get(0)?,
            path: row.get(1)?,
            is_folder: is_dir,
            children: if is_dir { Some(vec![]) } else { None },
        })
    })?;
    let mut nodes = Vec::new();
    for node in rows.flatten() {
        nodes.push(node);
    }
    Ok(nodes)
}

#[tauri::command]
pub async fn list_folder_from_db(
    state: tauri::State<'_, AppState>,
    path: String,
) -> Result<Vec<FileNode>, String> {
    get_children_from_db(state.db.clone(), &path).map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn index_project_db(
    state: tauri::State<'_, AppState>,
    path: String,
) -> Result<(), String> {
    let db = state.db.clone();
    let p = path.clone();
    tauri::async_runtime::spawn_blocking(move || {
        // Set lower priority for background indexing on Linux
        #[cfg(target_os = "linux")]
        unsafe {
            let tid = libc::gettid();
            // Niceness 10 is lower priority than default 0
            libc::setpriority(libc::PRIO_PROCESS, tid as u32, 10);
        }
        index_project_in_db(db, &p, &p)
    })
    .await
    .map_err(|e| e.to_string())?
    .map_err(|e| e.to_string())
}
