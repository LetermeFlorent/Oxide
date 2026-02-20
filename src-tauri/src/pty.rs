use portable_pty::{Child, MasterPty};
use std::io::Write;
use std::sync::{Arc, Mutex};

pub struct PtySession {
    pub writer: Box<dyn Write + Send>,
    pub master: Box<dyn MasterPty + Send>,
    pub child: Box<dyn Child + Send>,
    pub is_visible: Arc<Mutex<bool>>,
}
