
use crate::scan_dir::scan_dir;
use crate::binary::serialization::serialize_tree_binary;

#[tauri::command]
pub async fn scan_project_binary(path: String, recursive: Option<bool>) -> Result<Vec<u8>, String> {
    let rec = recursive.unwrap_or(false);
    tauri::async_runtime::spawn_blocking(move || {
        let mut imgs = Vec::new();
        let tree = scan_dir(&path, &mut imgs, rec, 0);
        Ok(serialize_tree_binary(&tree, &imgs))
    }).await.map_err(|e| e.to_string())?
}
