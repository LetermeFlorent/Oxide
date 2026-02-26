
use crate::fs::FileNode;
use crate::scan_dir::filters::{is_ignored, is_image};
use crate::scan_dir::sorter::sort_nodes;
use std::fs;
use tauri::{AppHandle, Emitter};

pub fn scan_dir_streaming(app: &AppHandle, event_id: &str, dir_path: &str, images: &mut Vec<FileNode>, recursive: bool, depth: u32) -> Vec<FileNode> {
    if depth > 5 { return vec![]; }
    let mut nodes = Vec::new();
    let mut batch = Vec::new();
    if let Ok(entries) = fs::read_dir(dir_path) {
        for entry in entries.flatten().take(5000) {
            let path = entry.path();
            let name = entry.file_name().to_string_lossy().to_string();
            let is_dir = path.is_dir();
            let path_str = path.to_string_lossy().to_string();
            if is_dir && is_ignored(&name) {
                let node = FileNode { name, path: path_str, is_folder: true, children: Some(vec![]) };
                nodes.push(node.clone()); batch.push(node); continue;
            }
            if !is_dir && is_image(&name) {
                images.push(FileNode { name: name.clone(), path: path_str.clone(), is_folder: false, children: None });
            }
            let children = if is_dir {
                if recursive && depth < 3 { Some(scan_dir_streaming(app, event_id, &path_str, images, true, depth + 1)) } else { Some(vec![]) }
            } else { None };
            let node = FileNode { name, path: path_str, is_folder: is_dir, children };
            nodes.push(node.clone()); batch.push(node);
            if batch.len() >= 100 { let _ = app.emit(&format!("fs-chunk-{}", event_id), &batch); batch.clear(); }
        }
    }
    if !batch.is_empty() { let _ = app.emit(&format!("fs-chunk-{}", event_id), &batch); }
    sort_nodes(&mut nodes);
    nodes
}
