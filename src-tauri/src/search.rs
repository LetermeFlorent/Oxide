use serde::{Deserialize, Serialize};
use std::fs;
use walkdir::{WalkDir, DirEntry};

#[derive(Debug, Serialize, Deserialize)]
pub struct SearchResult {
  pub path: String,
  pub line: usize,
  pub content: String,
}

#[tauri::command]
pub async fn search_in_projects(paths: Vec<String>, query: String) -> Result<Vec<SearchResult>, String> {
    let query = query.to_lowercase();
    if query.len() < 2 { return Ok(vec![]); }

    tauri::async_runtime::spawn_blocking(move || {
        let mut all_results = Vec::new();
        for root_path in paths {
            let walker = WalkDir::new(&root_path).into_iter();
            for entry_res in walker.filter_entry(|e: &DirEntry| {
                let name = e.file_name().to_string_lossy();
                ! (name == "node_modules" || name == ".git" || name == "target" || name == "dist")
            }) {
                if let Ok(entry) = entry_res {
                    if entry.file_type().is_file() {
                        if let Ok(content) = fs::read_to_string(entry.path()) {
                            for (idx, line) in content.lines().enumerate() {
                                if line.to_lowercase().contains(&query) {
                                    all_results.push(SearchResult {
                                        path: entry.path().to_string_lossy().to_string(),
                                        line: idx + 1,
                                        content: line.trim().to_string(),
                                    });
                                    if all_results.len() > 500 { return Ok(all_results); }
                                }
                            }
                        }
                    }
                }
            }
        }
        Ok(all_results)
    }).await.map_err(|e| e.to_string())?
}
