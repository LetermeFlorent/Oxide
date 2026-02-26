
use crate::state::AppState;
use portable_pty::PtySize;

#[tauri::command]
pub fn resize_pty(state: tauri::State<'_, AppState>, id: String, rows: u16, cols: u16) -> Result<(), String> {
    if let Some(s) = state.sessions.lock().unwrap().get(&id) {
        let _ = s.master.resize(PtySize { rows, cols, pixel_width: 0, pixel_height: 0 });
    }
    Ok(())
}

#[tauri::command]
pub fn close_pty(state: tauri::State<'_, AppState>, id: String) -> Result<(), String> {
    if let Some(mut s) = state.sessions.lock().unwrap().remove(&id) { let _ = s.child.kill(); }
    Ok(())
}

#[tauri::command]
pub fn set_pty_visibility(state: tauri::State<'_, AppState>, id: String, visible: bool) -> Result<(), String> {
    if let Some(s) = state.sessions.lock().unwrap().get(&id) { *s.is_visible.lock().unwrap() = visible; }
    Ok(())
}
