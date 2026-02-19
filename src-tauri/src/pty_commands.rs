use crate::state::AppState;
use portable_pty::PtySize;
use std::io::Write;

#[tauri::command]
pub fn write_to_pty(state: tauri::State<'_, AppState>, id: String, data: String) -> Result<(), String> {
    let mut sessions = state.sessions.lock().unwrap();
    if let Some(session) = sessions.get_mut(&id) {
        session.writer.write_all(data.as_bytes()).map_err(|e| e.to_string())?;
        let _ = session.writer.flush();
        Ok(())
    } else { Err("No session found".into()) }
}

#[tauri::command]
pub fn set_pty_visibility(state: tauri::State<'_, AppState>, id: String, visible: bool) -> Result<(), String> {
    if let Some(session) = state.sessions.lock().unwrap().get(&id) {
        *session.is_visible.lock().unwrap() = visible;
    }
    Ok(())
}

#[tauri::command]
pub fn resize_pty(state: tauri::State<'_, AppState>, id: String, rows: u16, cols: u16) -> Result<(), String> {
    if let Some(session) = state.sessions.lock().unwrap().get(&id) {
        let _ = session.master.resize(PtySize { rows, cols, pixel_width: 0, pixel_height: 0 });
    }
    Ok(())
}

#[tauri::command]
pub fn close_pty(state: tauri::State<'_, AppState>, id: String) -> Result<(), String> {
    if let Some(mut session) = state.sessions.lock().unwrap().remove(&id) { let _ = session.child.kill(); }
    Ok(())
}
