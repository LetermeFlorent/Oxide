
use rusqlite::{params, Connection, Result};
use std::sync::{Arc, Mutex};
use walkdir::WalkDir;

pub fn index_project_in_db(db: Arc<Mutex<Connection>>, pid: &str, root: &str) -> Result<()> {
    let mut entries = Vec::new();
    for e in WalkDir::new(root).max_depth(10).into_iter().flatten() {
        let n = e.file_name().to_string_lossy();
        if matches!(n.as_ref(), "node_modules" | ".git" | "target" | "dist" | "build") { continue; }
        entries.push((e.path().parent().map(|p| p.to_string_lossy().to_string()), n.to_string(), e.path().to_string_lossy().to_string(), e.file_type().is_dir()));
    }
    let mut conn = db.lock().map_err(|_| rusqlite::Error::ExecuteReturnedResults)?;
    let tx = conn.transaction()?;
    tx.execute("DELETE FROM files WHERE project_id = ?", params![pid])?;
    {
        let mut st = tx.prepare_cached("INSERT OR IGNORE INTO files (project_id, parent_path, name, path, is_folder) VALUES (?, ?, ?, ?, ?)")?;
        for (par, n, p, is_f) in entries { let _ = st.execute(params![pid, par, n, p, if is_f { 1 } else { 0 }]); }
    }
    tx.commit()
}
