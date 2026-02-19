use crate::fs::FileNode;
use crate::state::AppState;
use crate::scan_dir::scan_dir;
use tauri::State;
use std::path::Path;
use bincode::{encode_to_vec, decode_from_slice, config};

#[tauri::command]
pub async fn index_project_lsm(state: State<'_, AppState>, path: String) -> Result<(), String> {
    let lsm_db = state.lsm_db.lock().unwrap().clone().ok_or("LSM DB not initialized")?;
    tauri::async_runtime::spawn_blocking(move || {
        let tree = scan_dir(&path, &mut Vec::new(), true, 0);
        let meta = lsm_db.open_tree("meta").map_err(|e| e.to_string())?;
        let hier = lsm_db.open_tree("hierarchy").map_err(|e| e.to_string())?;
        for n in flatten_tree(tree) { store_node(&meta, &hier, n)?; }
        Ok(())
    }).await.map_err(|e| e.to_string())?
}

#[tauri::command]
pub async fn list_folder_lsm(state: State<'_, AppState>, path: String) -> Result<Vec<FileNode>, String> {
    let lsm = state.lsm_db.lock().unwrap().clone().ok_or("LSM DB not initialized")?;
    let (m, h) = (lsm.open_tree("meta").unwrap(), lsm.open_tree("hierarchy").unwrap());
    let ps: Vec<String> = match h.get(&path).unwrap() {
        Some(v) => decode_from_slice(&v, config::standard()).unwrap().0,
        None => return Ok(Vec::new()),
    };
    Ok(ps.iter().filter_map(|p| m.get(p).unwrap().map(|v| decode_from_slice(&v, config::standard()).unwrap().0)).collect())
}

fn store_node(meta: &sled::Tree, hier: &sled::Tree, n: FileNode) -> Result<(), String> {
    let path = n.path.clone();
    meta.insert(&path, encode_to_vec(&n, config::standard()).unwrap()).unwrap();
    if let Some(p) = Path::new(&path).parent().and_then(|p| p.to_str()) {
        let mut c: Vec<String> = hier.get(p).unwrap().map(|v| decode_from_slice(&v, config::standard()).unwrap().0).unwrap_or_default();
        if !c.contains(&path) { c.push(path.clone()); hier.insert(p, encode_to_vec(&c, config::standard()).unwrap()).unwrap(); }
    }
    Ok(())
}

fn flatten_tree(nodes: Vec<FileNode>) -> Vec<FileNode> {
    let mut flat = Vec::new();
    for mut n in nodes {
        let c = n.children.take(); flat.push(n);
        if let Some(list) = c { flat.extend(flatten_tree(list)); }
    }
    flat
}
