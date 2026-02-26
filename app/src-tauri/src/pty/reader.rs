
use std::io::Read;
use std::sync::{Arc, Mutex};
use tauri::{AppHandle, Emitter};

pub fn spawn_reader(app: AppHandle, id: String, mut reader: Box<dyn Read + Send>, is_visible: Arc<Mutex<bool>>, buffer: Arc<Mutex<Vec<u8>>>) {
    std::thread::spawn(move || {
        let mut buf = [0u8; 8192];
        while let Ok(n) = reader.read(&mut buf) {
            if n == 0 { break; }
            let bytes = &buf[..n];
            {
                let mut b = buffer.lock().unwrap(); b.extend_from_slice(bytes);
                if b.len() > 512 * 1024 { let to_rem = b.len() - (512 * 1024); b.drain(0..to_rem); }
            }
            if *is_visible.lock().unwrap() { let _ = app.emit(&format!("pty-data-{}", id), &String::from_utf8_lossy(bytes)); }
            let s = if bytes.ends_with(b"$ ") || bytes.ends_with(b"# ") || bytes.ends_with(b"> ") || bytes.ends_with(b"% ") { "idle" } else { "working" };
            let _ = app.emit(&format!("pty-status-{}", id), s);
        }
    });
}
