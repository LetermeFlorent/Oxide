
use crate::state::AppState;
use std::io::Write;

#[tauri::command]
pub fn write_to_pty(state: tauri::State<'_, AppState>, id: String, data: String) -> Result<(), String> {
    let mut map = state.sessions.lock().unwrap();
    let s = map.get_mut(&id).ok_or("No session found")?;
    s.writer.write_all(data.as_bytes()).map_err(|e| e.to_string())?;
    s.writer.flush().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn write_to_all_ptys(state: tauri::State<'_, AppState>, ids: Vec<String>, data: String) -> Result<(), String> {
    let mut map = state.sessions.lock().unwrap();
    for id in ids { if let Some(s) = map.get_mut(&id) { let _ = s.writer.write_all(data.as_bytes()); let _ = s.writer.flush(); } }
    Ok(())
}

#[tauri::command]
pub fn get_pty_buffer(state: tauri::State<'_, AppState>, id: String) -> Result<String, String> {
    let buf_arc = {
        let map = state.sessions.lock().unwrap();
        map.get(&id).ok_or("No session found")?.buffer.clone()
    };
    let data = buf_arc.lock().unwrap();
    Ok(String::from_utf8_lossy(&data).to_string())
}

#[tauri::command]
pub fn clear_pty_buffer(state: tauri::State<'_, AppState>, id: String) -> Result<(), String> {
    let mut map = state.sessions.lock().unwrap();
    let s = map.get_mut(&id).ok_or("No session found")?;
    let mut data = s.buffer.lock().unwrap();
    data.clear();
    Ok(())
}
