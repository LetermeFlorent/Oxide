use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use portable_pty::NativePtySystem;
use notify::Watcher;
use crate::pty::PtySession;
use sled::Db;
use rusqlite::Connection;

pub struct AppState {
  pub sessions: Arc<Mutex<HashMap<String, PtySession>>>,
  pub pty_system: NativePtySystem,
  pub watchers: Arc<Mutex<HashMap<String, (Box<dyn Watcher + Send>, Vec<String>)>>>,
  pub lsm_db: Arc<Mutex<Option<Db>>>,
  pub db: Arc<Mutex<Connection>>,
}

impl AppState {
    pub fn new(db: Connection) -> Self {
        Self {
            sessions: Arc::new(Mutex::new(HashMap::new())),
            pty_system: NativePtySystem::default(),
            watchers: Arc::new(Mutex::new(HashMap::new())),
            lsm_db: Arc::new(Mutex::new(None)),
            db: Arc::new(Mutex::new(db)),
        }
    }
}
