
use crate::search::models::SearchResult;
use ignore::WalkBuilder;
use std::fs;
use std::sync::{Arc, Mutex};
use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct SearchOptions {
    pub case_sensitive: bool,
    pub use_regex: bool,
    pub whole_word: bool,
}

#[tauri::command]
pub async fn search_in_projects(
    paths: Vec<String>, 
    query: String, 
    options: SearchOptions
) -> Result<Vec<SearchResult>, String> {
    if query.len() < 2 { return Ok(vec![]); }

    let query_arc = Arc::new(if options.case_sensitive { query } else { query.to_lowercase() });
    let results = Arc::new(Mutex::new(Vec::new()));

    tauri::async_runtime::spawn_blocking::<_, Result<Vec<SearchResult>, String>>(move || {
        for root in paths {
            let results_clone = Arc::clone(&results);
            let query_clone = Arc::clone(&query_arc);
            
            let walker = WalkBuilder::new(&root)
                .hidden(true)
                .git_ignore(true)
                .threads(num_cpus::get())
                .build_parallel();

            walker.run(|| {
                let results = Arc::clone(&results_clone);
                let query = Arc::clone(&query_clone);
                
                Box::new(move |entry| {
                    let entry = match entry {
                        Ok(e) => e,
                        Err(_) => return ignore::WalkState::Continue,
                    };

                    if entry.file_type().map(|ft| ft.is_file()).unwrap_or(false) {
                        if let Ok(content) = fs::read_to_string(entry.path()) {
                            let mut local_results = Vec::new();
                            for (idx, line) in content.lines().enumerate() {
                                let match_line = if options.case_sensitive { 
                                    line.to_string() 
                                } else { 
                                    line.to_lowercase() 
                                };

                                if match_line.contains(&*query) {
                                    local_results.push(SearchResult {
                                        path: entry.path().to_string_lossy().to_string(),
                                        line: idx + 1,
                                        content: line.trim().to_string(),
                                    });
                                }
                                if local_results.len() > 100 { break; }
                            }

                            if !local_results.is_empty() {
                                let mut global_results = results.lock().unwrap();
                                global_results.extend(local_results);
                                if global_results.len() > 1000 {
                                    return ignore::WalkState::Quit;
                                }
                            }
                        }
                    }
                    ignore::WalkState::Continue
                })
            });
        }
        
        let final_results = results.lock().unwrap().clone();
        Ok(final_results)
    }).await.map_err(|e| e.to_string())?
}
