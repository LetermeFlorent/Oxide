/**!
 * @file lib.rs
 * @description Tauri backend for Oxide AI IDE
 * Provides PTY (terminal) management, file system operations, and workspace persistence
 *
 * Features:
 * - Multi-session PTY management with bash shells
 * - Project directory scanning with image detection
 * - Multi-threaded text search across projects
 * - Workspace state persistence
 *
 * @module tauri_backend
 */

use portable_pty::{CommandBuilder, NativePtySystem, PtySize, MasterPty, Child, PtySystem};
use std::collections::HashMap;
use std::io::{Read, Write};
use std::sync::{Arc, Mutex};
use std::thread;
use tauri::{AppHandle, Manager, Emitter};
use serde::{Deserialize, Serialize};
use std::fs;
use walkdir::{WalkDir, DirEntry};

/// Represents a file or folder in the project tree
#[derive(Debug, Serialize, Deserialize)]
struct FileNode {
  name: String,
  path: String,
  #[serde(rename = "isFolder")]
  is_folder: bool,
  children: Option<Vec<FileNode>>,
}

/// Holds the state for a single PTY session
struct PtySession {
  writer: Box<dyn Write + Send>,
  master: Box<dyn MasterPty + Send>,
  child: Box<dyn Child + Send>,
  is_visible: Arc<Mutex<bool>>,
}

/// Global state container for all PTY sessions
struct PtyState {
  sessions: Arc<Mutex<HashMap<String, PtySession>>>,
  pty_system: NativePtySystem,
}

/// Sets the visibility state of a PTY session
/// Used to suspend/resume data streaming when terminal is not visible
#[tauri::command]
fn set_pty_visibility(state: tauri::State<'_, PtyState>, id: String, visible: bool) -> Result<(), String> {
    let sessions = state.sessions.lock().unwrap();
    if let Some(session) = sessions.get(&id) {
        let mut v = session.is_visible.lock().unwrap();
        *v = visible;
    }
    Ok(())
}

/// Represents a single search result match
#[derive(Debug, Serialize, Deserialize)]
struct SearchResult {
  path: String,
  line: usize,
  content: String,
}

/// Searches for text across multiple project directories
/// Uses multi-threading for performance and limits results to 500
#[tauri::command]
async fn search_in_projects(paths: Vec<String>, query: String) -> Result<Vec<SearchResult>, String> {
    let query = query.to_lowercase();
    if query.len() < 2 { return Ok(vec![]); }

    println!("[Backend] Global Search: '{}' in {} projects", query, paths.len());

    let results = tauri::async_runtime::spawn_blocking(move || {
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
                                    if all_results.len() > 500 { return all_results; }
                                }
                            }
                        }
                    }
                }
            }
        }
        all_results
    }).await.map_err(|e| e.to_string())?;

    Ok(results)
}

/// Result of scanning a project directory
#[derive(Debug, Serialize, Deserialize)]
struct ScanResult {
    tree: Vec<FileNode>,
    images: Vec<FileNode>,
}

/// Scans a project directory and returns the file tree and image files
#[tauri::command]
async fn scan_project(path: String, recursive: Option<bool>) -> Result<ScanResult, String> {
    let rec = recursive.unwrap_or(false);
    println!("[Backend] Scanning project (Recursive: {}): {}", rec, path);
    let result = tauri::async_runtime::spawn_blocking(move || {
        let mut images = Vec::new();
        let tree = scan_dir(&path, &mut images, rec);
        ScanResult { tree, images }
    }).await.map_err(|e| e.to_string())?;
    Ok(result)
}

/// Recursively scans a directory and builds the file tree
/// Collects image files separately for the gallery view
fn scan_dir(dir_path: &str, images: &mut Vec<FileNode>, recursive: bool) -> Vec<FileNode> {
    let mut nodes = Vec::new();
    if let Ok(entries) = fs::read_dir(dir_path) {
        for entry in entries.flatten() {
            let path = entry.path();
            let name = entry.file_name().to_string_lossy().to_string();
            let is_dir = path.is_dir();
            let path_str = path.to_string_lossy().to_string();

            if is_dir && (name == "node_modules" || name == "target" || name == ".git" || name == "dist" || name == "build") {
                nodes.push(FileNode { name, path: path_str, is_folder: true, children: Some(vec![]) });
                continue;
            }

            if !is_dir {
                let lower = name.to_lowercase();
                if lower.ends_with(".png") || lower.ends_with(".jpg") || lower.ends_with(".jpeg") || lower.ends_with(".gif") || lower.ends_with(".webp") || lower.ends_with(".svg") {
                    images.push(FileNode { name: name.clone(), path: path_str.clone(), is_folder: false, children: None });
                }
            }

            let children = if is_dir {
                if recursive { Some(scan_dir(&path_str, images, true)) }
                else { Some(vec![]) }
            } else { None };
            nodes.push(FileNode { name, path: path_str, is_folder: is_dir, children });
        }
    }
    nodes.sort_by(|a, b| {
        if a.is_folder == b.is_folder { a.name.cmp(&b.name) }
        else if a.is_folder { std::cmp::Ordering::Less }
        else { std::cmp::Ordering::Greater }
    });
    nodes
}

/// Saves the workspace state to a temporary file
#[tauri::command]
fn save_workspace(state_json: String) -> Result<(), String> {
    thread::spawn(move || {
        let path = std::env::temp_dir().join("oxide_workspace_state.json");
        let _ = fs::write(path, state_json);
    });
    Ok(())
}

/// Spawns a new PTY (pseudo-terminal) session with bash
/// Returns true if a new session was created, false if one already exists
#[tauri::command]
fn spawn_pty(app: AppHandle, id: String, cwd: Option<String>, rows: u16, cols: u16) -> Result<bool, String> {
    let state = app.state::<PtyState>();
    {
        let sessions = state.sessions.lock().unwrap();
        if sessions.contains_key(&id) { return Ok(false); }
    }
    let pair = state.pty_system
        .openpty(PtySize { rows, cols, pixel_width: 0, pixel_height: 0 })
        .map_err(|e| format!("Failed to openpty: {}", e))?;
    let mut cmd = CommandBuilder::new("bash");
    cmd.env("TERM", "xterm-256color");
    if let Some(path) = cwd { if std::path::Path::new(&path).exists() { cmd.cwd(path); } }
    let child = pair.slave.spawn_command(cmd).map_err(|e| format!("Failed to spawn bash: {}", e))?;
    let mut reader = pair.master.try_clone_reader().map_err(|e| e.to_string())?;
    let writer = pair.master.take_writer().map_err(|e| e.to_string())?;
    let is_visible = Arc::new(Mutex::new(true));
    {
        let mut sessions = state.sessions.lock().unwrap();
        sessions.insert(id.clone(), PtySession { writer, master: pair.master, child, is_visible: is_visible.clone() });
    }
    let data_event = format!("pty-data-{}", id);
    let status_event = format!("pty-status-{}", id);
    let app_clone = app.clone();
    thread::spawn(move || {
        let mut buffer = [0u8; 8192];
        while let Ok(n) = reader.read(&mut buffer) {
            if n == 0 { break; }
            thread::sleep(std::time::Duration::from_millis(20));
            let data = String::from_utf8_lossy(&buffer[..n]).to_string();
            if *is_visible.lock().unwrap() { let _ = app_clone.emit(&data_event, &data); }
            let lower_data = data.to_lowercase();
            let status = if lower_data.contains("thinking") || lower_data.contains("generating") || lower_data.contains("working") { "working" }
            else if lower_data.contains("intervention") || lower_data.contains("approve") || lower_data.contains("confirm") { "intervene" }
            else if lower_data.contains("> ") || lower_data.contains("$ ") || lower_data.contains("# ") { "idle" }
            else { "busy" };
            let _ = app_clone.emit(&status_event, status);
        }
    });
    Ok(true)
}

/// Writes data to a specific PTY session
#[tauri::command]
fn write_to_pty(state: tauri::State<'_, PtyState>, id: String, data: String) -> Result<(), String> {
    let mut sessions = state.sessions.lock().unwrap();
    if let Some(session) = sessions.get_mut(&id) {
        session.writer.write_all(data.as_bytes()).map_err(|e| e.to_string())?;
        let _ = session.writer.flush();
        Ok(())
    } else { Err("No session found".into()) }
}

/// Broadcasts data to multiple PTY sessions
#[tauri::command]
fn write_to_all_ptys(state: tauri::State<'_, PtyState>, ids: Vec<String>, data: String) -> Result<(), String> {
    let mut sessions = state.sessions.lock().unwrap();
    for id in ids {
        if let Some(session) = sessions.get_mut(&id) {
            let _ = session.writer.write_all(data.as_bytes());
            let _ = session.writer.flush();
        }
    }
    Ok(())
}

/// Resizes a PTY session to new dimensions
#[tauri::command]
fn resize_pty(state: tauri::State<'_, PtyState>, id: String, rows: u16, cols: u16) -> Result<(), String> {
    let sessions = state.sessions.lock().unwrap();
    if let Some(session) = sessions.get(&id) {
        let _ = session.master.resize(PtySize { rows, cols, pixel_width: 0, pixel_height: 0 });
    }
    Ok(())
}

/// Closes and kills a PTY session
#[tauri::command]
fn close_pty(state: tauri::State<'_, PtyState>, id: String) -> Result<(), String> {
    let mut sessions = state.sessions.lock().unwrap();
    if let Some(mut session) = sessions.remove(&id) { let _ = session.child.kill(); }
    Ok(())
}

/// Application entry point for Tauri
/// Sets up the PTY state manager and registers all command handlers
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(PtyState {
            sessions: Arc::new(Mutex::new(HashMap::new())),
            pty_system: NativePtySystem::default(),
        })
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![spawn_pty, write_to_pty, write_to_all_ptys, resize_pty, close_pty, scan_project, set_pty_visibility, save_workspace, search_in_projects])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
