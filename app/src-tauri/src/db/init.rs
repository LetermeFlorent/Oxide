
use rusqlite::{Connection, Result};

pub fn init_db(app_dir: &std::path::Path) -> Result<Connection> {
    let db_path = app_dir.join("oxide.db");
    let conn = Connection::open(&db_path).map_err(|e| {
        eprintln!("[CRITICAL] Could not open database at {:?}: {}", db_path, e);
        e
    })?;
    conn.execute("CREATE TABLE IF NOT EXISTS files (id INTEGER PRIMARY KEY, project_id TEXT NOT NULL, parent_path TEXT, name TEXT NOT NULL, path TEXT NOT NULL UNIQUE, is_folder INTEGER NOT NULL)", [])?;
    conn.execute("CREATE INDEX IF NOT EXISTS idx_parent ON files (parent_path)", [])?;
    conn.execute("CREATE INDEX IF NOT EXISTS idx_project ON files (project_id)", [])?;
    Ok(conn)
}
