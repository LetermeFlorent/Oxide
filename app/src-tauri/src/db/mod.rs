
pub mod init;
pub mod indexing;

pub use init::init_db;
pub use indexing::index_project_in_db;

use rusqlite::{params, Connection, Result};
use crate::fs::FileNode;
use tauri::State;
use crate::state::AppState;
use std::sync::{Arc, Mutex};

pub fn get_children_internal(db: Arc<Mutex<Connection>>, pid: &str, par: &str) -> Result<Vec<FileNode>, String> {
    let db = db.lock().map_err(|e| e.to_string())?;
    let mut st = db.prepare("SELECT name, path, is_folder FROM files WHERE project_id = ? AND parent_path = ?").map_err(|e| e.to_string())?;
    let iter = st.query_map(params![pid, par], |r| Ok(FileNode { name: r.get(0)?, path: r.get(1)?, is_folder: r.get::<_, i32>(2)? == 1, children: Some(vec![]) })).map_err(|e| e.to_string())?;
    let mut res = Vec::new();
    for n in iter { res.push(n.map_err(|e| e.to_string())?); }
    Ok(res)
}

#[tauri::command]
pub async fn list_folder_from_db(state: State<'_, AppState>, pid: String, par: Option<String>) -> Result<Vec<FileNode>, String> {
    get_children_internal(state.db.clone(), &pid, &par.unwrap_or_default())
}

#[tauri::command]
pub async fn index_project_db(state: State<'_, AppState>, path: String) -> Result<(), String> {
    index_project_in_db(state.db.clone(), &path, &path).map_err(|e| e.to_string())
}
