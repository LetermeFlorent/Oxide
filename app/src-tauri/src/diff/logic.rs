
use crate::fs::{FileNode, FilePatch};
use crate::scan_dir::scan_dir;
use crate::lsm::storage::store_node;
use bincode::{config, decode_from_slice, encode_to_vec};
use std::sync::{Arc, Mutex};
use sled::Db;

pub fn calculate_diff(db: Arc<Mutex<Option<Db>>>, _pid: &str, par: &str) -> Result<FilePatch, String> {
    let db_guard = db.lock().unwrap();
    let db = db_guard.as_ref().ok_or("LSM DB not initialized")?;
    let (meta, hier) = (db.open_tree("meta").unwrap(), db.open_tree("hierarchy").unwrap());

    let mut imgs = Vec::new();
    let disk = scan_dir(par, &mut imgs, false, 0);
    
    // Get existing children from LSM
    let db_n: Vec<FileNode> = match hier.get(par).unwrap() {
        Some(v) => {
            let ps: Vec<String> = decode_from_slice(&v, config::standard()).unwrap().0;
            ps.iter().filter_map(|p| meta.get(p).unwrap().map(|v| decode_from_slice(&v, config::standard()).unwrap().0)).collect()
        },
        None => vec![]
    };

    let mut add = Vec::new(); 
    let mut rem = Vec::new();

    for d in &disk { if !db_n.iter().any(|n| n.path == d.path) { add.push(d.clone()); } }
    for n in &db_n { if !disk.iter().any(|d| d.path == n.path) { rem.push(n.path.clone()); } }

    if !add.is_empty() || !rem.is_empty() {
        for n in &add { let _ = store_node(&meta, &hier, n.clone()); }
        for p in &rem { 
            let _ = meta.remove(p); 
            let mut c: Vec<String> = hier.get(par).unwrap().map(|v| decode_from_slice(&v, config::standard()).unwrap().0).unwrap_or_default();
            c.retain(|x| x != p);
            hier.insert(par, encode_to_vec(&c, config::standard()).unwrap()).unwrap();
        }
    }

    Ok(FilePatch { project_id: _pid.to_string(), parent_path: par.to_string(), added: add, removed: rem })
}
