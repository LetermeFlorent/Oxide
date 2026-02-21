use crate::pty::PtySession;
use crate::state::AppState;
use portable_pty::{CommandBuilder, PtySize, PtySystem};
use std::io::Read;
use std::sync::{Arc, Mutex};
use std::thread;
use tauri::{AppHandle, Emitter, Manager};

#[tauri::command]
pub fn spawn_pty(
    app: AppHandle,
    id: String,
    cwd: Option<String>,
    rows: u16,
    cols: u16,
) -> Result<bool, String> {
    let state = app.state::<AppState>();
    if state.sessions.lock().unwrap().contains_key(&id) {
        return Ok(false);
    }
    let pair = state
        .pty_system
        .openpty(PtySize {
            rows,
            cols,
            pixel_width: 0,
            pixel_height: 0,
        })
        .map_err(|e| e.to_string())?;

    #[cfg(target_os = "windows")]
    let mut cmd = CommandBuilder::new("cmd.exe");
    #[cfg(not(target_os = "windows"))]
    let mut cmd = CommandBuilder::new("bash");
    #[cfg(not(target_os = "windows"))]
    cmd.arg("-i");

    #[cfg(not(target_os = "windows"))]
    cmd.env("TERM", "xterm-256color");

    if let Some(path) = cwd {
        if std::path::Path::new(&path).exists() {
            cmd.cwd(path);
        }
    }
    let child = pair.slave.spawn_command(cmd).map_err(|e| e.to_string())?;
    let mut reader = pair.master.try_clone_reader().map_err(|e| e.to_string())?;
    let writer = pair.master.take_writer().map_err(|e| e.to_string())?;
    let is_visible = Arc::new(Mutex::new(false));
    let output_buffer = Arc::new(Mutex::new(Vec::with_capacity(8192)));
    state.sessions.lock().unwrap().insert(
        id.clone(),
        PtySession {
            writer,
            master: pair.master,
            child,
            is_visible: is_visible.clone(),
            buffer: output_buffer.clone(),
        },
    );

    let app_clone = app.clone();
    let id_clone = id.clone();
    thread::spawn(move || {
        // Set higher priority for the terminal reader thread on Linux
        #[cfg(target_os = "linux")]
        unsafe {
            let tid = libc::gettid();
            // Niceness -10 is higher priority than default 0
            libc::setpriority(libc::PRIO_PROCESS, tid as u32, -10);
        }

        let mut buffer = [0u8; 8192];
        while let Ok(n) = reader.read(&mut buffer) {
            if n == 0 {
                break;
            }
            let data_bytes = &buffer[..n];
            
            // Store in buffer (limit to 512KB)
            {
                let mut b = output_buffer.lock().unwrap();
                b.extend_from_slice(data_bytes);
                if b.len() > 512 * 1024 {
                    let to_remove = b.len() - (512 * 1024);
                    b.drain(0..to_remove);
                }
            }

            let data = String::from_utf8_lossy(data_bytes).to_string();
            if *is_visible.lock().unwrap() {
                let _ = app_clone.emit(&format!("pty-data-{}", id_clone), &data);
            }
            
            // Smarter status detection: if it ends with a common prompt suffix
            let status = if data.ends_with("$ ") || data.ends_with("# ") || data.ends_with("> ") || data.ends_with("% ") {
                "idle"
            } else {
                "working"
            };
            let _ = app_clone.emit(&format!("pty-status-{}", id_clone), status);
        }
    });
    Ok(true)
}
