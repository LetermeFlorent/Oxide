use rusqlite::{params, Connection, Result};
use std::sync::{Arc, Mutex};
use walkdir::WalkDir;

pub fn init_db(app_dir: &std::path::Path) -> Result<Connection> {
    let db_path = app_dir.join("oxide.db");
    let conn = Connection::open(db_path)?;
    conn.execute("CREATE TABLE IF NOT EXISTS files (id INTEGER PRIMARY KEY, project_id TEXT NOT NULL, parent_path TEXT, name TEXT NOT NULL, path TEXT NOT NULL UNIQUE, is_folder INTEGER NOT NULL)", [])?;
    conn.execute(
        "CREATE INDEX IF NOT EXISTS idx_parent ON files (parent_path)",
        [],
    )?;
    conn.execute(
        "CREATE INDEX IF NOT EXISTS idx_project ON files (project_id)",
        [],
    )?;
    Ok(conn)
}

pub fn index_project_in_db(
    db: Arc<Mutex<Connection>>,
    project_id: &str,
    root_path: &str,
) -> Result<()> {
    // 1. Collect all entries first without holding the lock
    let mut entries_to_index = Vec::new();
    for entry in WalkDir::new(root_path).max_depth(10).into_iter().flatten() {
        let path = entry.path();
        let name = entry.file_name().to_string_lossy().to_string();
        if name == "node_modules" || name == ".git" || name == "target" || name == "dist" || name == "build" {
            continue;
        }
        
        let parent_path = path.parent().map(|p| p.to_string_lossy().to_string());
        let path_str = path.to_string_lossy().to_string();
        let is_folder = entry.file_type().is_dir();
        
        entries_to_index.push((parent_path, name, path_str, is_folder));
    }

    // 2. Lock the connection and use a transaction for high-speed batch insertion
    let mut conn = db.lock().map_err(|_| rusqlite::Error::ExecuteReturnedResults)?;
    let tx = conn.transaction()?;

    tx.execute(
        "DELETE FROM files WHERE project_id = ?",
        params![project_id],
    )?;

    {
        let mut stmt = tx.prepare_cached("INSERT OR IGNORE INTO files (project_id, parent_path, name, path, is_folder) VALUES (?, ?, ?, ?, ?)")?;
        for (parent_path, name, path_str, is_folder) in entries_to_index {
            let _ = stmt.execute(params![
                project_id,
                parent_path,
                name,
                path_str,
                if is_folder { 1 } else { 0 }
            ]);
        }
    }

    tx.commit()?;
    Ok(())
}
