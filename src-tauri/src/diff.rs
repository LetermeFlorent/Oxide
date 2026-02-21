use crate::db::get_children_from_db;
use crate::fs::FilePatch;
use crate::scan_dir::scan_dir;
use crate::state::AppState;
use rusqlite::params;
use std::sync::{Arc, Mutex};

pub fn calculate_diff(
    db: Arc<Mutex<rusqlite::Connection>>,
    project_id: &str,
    parent_path: &str,
) -> Result<FilePatch, String> {
    let mut images = Vec::new();
    let disk_nodes = scan_dir(parent_path, &mut images, false, 0);
    let db_nodes = get_children_from_db(db.clone(), parent_path).map_err(|e| e.to_string())?;

    let mut added = Vec::new();
    let mut removed = Vec::new();

    for disk in &disk_nodes {
        if !db_nodes.iter().any(|db| db.path == disk.path) {
            added.push(disk.clone());
        }
    }
    for db_node in &db_nodes {
        if !disk_nodes.iter().any(|disk| disk.path == db_node.path) {
            removed.push(db_node.path.clone());
        }
    }

    if !added.is_empty() || !removed.is_empty() {
        let conn = db.lock().unwrap();
        for node in &added {
            let _ = conn.execute("INSERT OR IGNORE INTO files (project_id, parent_path, name, path, is_folder) VALUES (?, ?, ?, ?, ?)", 
                params![project_id, Some(parent_path), node.name, node.path, if node.is_folder { 1 } else { 0 }]);
        }
        for path in &removed {
            let _ = conn.execute("DELETE FROM files WHERE path = ?", params![path]);
        }
    }

    Ok(FilePatch {
        project_id: project_id.to_string(),
        parent_path: parent_path.to_string(),
        added,
        removed,
    })
}

#[tauri::command]
pub async fn sync_dir(
    state: tauri::State<'_, AppState>,
    project_id: String,
    path: String,
) -> Result<FilePatch, String> {
    calculate_diff(state.db.clone(), &project_id, &path)
}
