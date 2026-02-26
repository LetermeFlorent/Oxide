
use crate::fs::FileNode;
use crate::scan_dir::scan_dir;
use crate::state::AppState;
use crate::lsm::storage::{flatten_tree, store_node};
use bincode::{config, decode_from_slice};
use tauri::State;

#[tauri::command]
pub async fn index_project_lsm(state: State<'_, AppState>, path: String) -> Result<(), String> {
    let db = state.lsm_db.lock().unwrap().clone().ok_or("LSM DB not initialized")?;
    tauri::async_runtime::spawn_blocking(move || {
        let (m, h) = (db.open_tree("meta").unwrap(), db.open_tree("hierarchy").unwrap());
        for n in flatten_tree(scan_dir(&path, &mut Vec::new(), true, 0)) { let _ = store_node(&m, &h, n); }
        Ok(())
    }).await.map_err(|e| e.to_string())?
}

#[tauri::command]
pub async fn list_folder_lsm(state: State<'_, AppState>, path: String) -> Result<Vec<FileNode>, String> {
    let db = state.lsm_db.lock().unwrap().clone().ok_or("LSM DB not initialized")?;
    let (m, h) = (db.open_tree("meta").unwrap(), db.open_tree("hierarchy").unwrap());
    let ps: Vec<String> = match h.get(&path).unwrap() { Some(v) => decode_from_slice(&v, config::standard()).unwrap().0, None => return Ok(vec![]) };
    Ok(ps.iter().filter_map(|p| m.get(p).unwrap().map(|v| decode_from_slice(&v, config::standard()).unwrap().0)).collect())
}
