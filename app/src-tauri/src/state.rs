use crate::pty::PtySession;
use notify::Watcher;
use portable_pty::NativePtySystem;
use sled::Db;
use std::collections::HashMap;
use std::sync::{Arc, Mutex};

pub type WatcherMap = HashMap<String, (Box<dyn Watcher + Send>, Vec<String>)>;

pub struct AppState {
    pub sessions: Arc<Mutex<HashMap<String, PtySession>>>,
    pub pty_system: NativePtySystem,
    pub watchers: Arc<Mutex<WatcherMap>>,
    pub lsm_db: Arc<Mutex<Option<Db>>>,
}

