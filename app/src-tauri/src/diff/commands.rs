
use crate::state::AppState;
use crate::fs::FilePatch;
use crate::diff::logic::calculate_diff;
use tauri::State;

#[tauri::command]
pub async fn sync_dir(state: State<'_, AppState>, project_id: String, path: String) -> Result<FilePatch, String> {
    calculate_diff(state.db.clone(), &project_id, &path)
}
