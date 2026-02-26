
use rusqlite::{Connection, Result};
use std::path::Path;

pub fn init_db(app_dir: &Path) -> Result<Connection> {
    let conn = Connection::open(app_dir.join("oxide.db"))?;
    conn.execute("CREATE TABLE IF NOT EXISTS files (id INTEGER PRIMARY KEY, project_id TEXT NOT NULL, parent_path TEXT, name TEXT NOT NULL, path TEXT NOT NULL UNIQUE, is_folder INTEGER NOT NULL)", [])?;
    conn.execute("CREATE INDEX IF NOT EXISTS idx_parent ON files (parent_path)", [])?;
    conn.execute("CREATE INDEX IF NOT EXISTS idx_project ON files (project_id)", [])?;
    Ok(conn)
}
