
use crate::db::get_children_internal;
use crate::fs::FilePatch;
use crate::scan_dir::scan_dir;
use rusqlite::{params, Connection};
use std::sync::{Arc, Mutex};

pub fn calculate_diff(db: Arc<Mutex<Connection>>, pid: &str, par: &str) -> Result<FilePatch, String> {
    let mut imgs = Vec::new();
    let disk = scan_dir(par, &mut imgs, false, 0);
    let db_n = get_children_internal(db.clone(), pid, par)?;
    let mut add = Vec::new(); let mut rem = Vec::new();
    for d in &disk { if !db_n.iter().any(|n| n.path == d.path) { add.push(d.clone()); } }
    for n in &db_n { if !disk.iter().any(|d| d.path == n.path) { rem.push(n.path.clone()); } }
    if !add.is_empty() || !rem.is_empty() {
        let conn = db.lock().unwrap();
        for n in &add { let _ = conn.execute("INSERT OR IGNORE INTO files (project_id, parent_path, name, path, is_folder) VALUES (?, ?, ?, ?, ?)", params![pid, Some(par), n.name, n.path, if n.is_folder { 1 } else { 0 }]); }
        for p in &rem { let _ = conn.execute("DELETE FROM files WHERE path = ?", params![p]); }
    }
    Ok(FilePatch { project_id: pid.to_string(), parent_path: par.to_string(), added: add, removed: rem })
}
