use crate::fs::FileNode;
use std::fs;
use tauri::{AppHandle, Emitter};

pub fn scan_dir_streaming(
    app: &AppHandle,
    event_id: &str,
    dir_path: &str,
    images: &mut Vec<FileNode>,
    recursive: bool,
    depth: u32,
) -> Vec<FileNode> {
    if depth > 5 {
        return vec![];
    }
    let mut nodes = Vec::new();
    let mut batch = Vec::new();

    if let Ok(entries) = fs::read_dir(dir_path) {
        for (count, entry) in entries.flatten().enumerate() {
            if count >= 5000 {
                break;
            }
            let path = entry.path();
            let name = entry.file_name().to_string_lossy().to_string();
            let is_dir = path.is_dir();
            let path_str = path.to_string_lossy().to_string();

            if is_dir
                && (name == "node_modules" || name == ".git" || name == "target" || name == "dist")
            {
                let node = FileNode {
                    name,
                    path: path_str,
                    is_folder: true,
                    children: Some(vec![]),
                };
                nodes.push(node.clone());
                batch.push(node);
                continue;
            }

            if !is_dir {
                let lower = name.to_lowercase();
                if [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"]
                    .iter()
                    .any(|&e| lower.ends_with(e))
                {
                    images.push(FileNode {
                        name: name.clone(),
                        path: path_str.clone(),
                        is_folder: false,
                        children: None,
                    });
                }
            }

            let children = if is_dir {
                if recursive && depth < 3 {
                    Some(scan_dir_streaming(
                        app,
                        event_id,
                        &path_str,
                        images,
                        true,
                        depth + 1,
                    ))
                } else {
                    Some(vec![])
                }
            } else {
                None
            };

            let node = FileNode {
                name,
                path: path_str,
                is_folder: is_dir,
                children,
            };
            nodes.push(node.clone());
            batch.push(node);

            // Stream every 100 items
            if batch.len() >= 100 {
                let _ = app.emit(&format!("fs-chunk-{}", event_id), batch.clone());
                batch.clear();
            }
        }
    }

    // Final batch
    if !batch.is_empty() {
        let _ = app.emit(&format!("fs-chunk-{}", event_id), &batch);
    }

    nodes.sort_by(|a, b| {
        if a.is_folder == b.is_folder {
            a.name.cmp(&b.name)
        } else if a.is_folder {
            std::cmp::Ordering::Less
        } else {
            std::cmp::Ordering::Greater
        }
    });
    nodes
}

pub fn scan_dir(
    dir_path: &str,
    images: &mut Vec<FileNode>,
    recursive: bool,
    depth: u32,
) -> Vec<FileNode> {
    if depth > 5 {
        return vec![];
    }
    let mut nodes = Vec::new();
    if let Ok(entries) = fs::read_dir(dir_path) {
        for (count, entry) in entries.flatten().enumerate() {
            if count >= 5000 {
                break;
            }
            let path = entry.path();
            let name = entry.file_name().to_string_lossy().to_string();
            let is_dir = path.is_dir();
            let path_str = path.to_string_lossy().to_string();

            if is_dir
                && (name == "node_modules"
                    || name == "target"
                    || name == ".git"
                    || name == "dist"
                    || name == "build")
            {
                nodes.push(FileNode {
                    name,
                    path: path_str,
                    is_folder: true,
                    children: Some(vec![]),
                });
                continue;
            }

            if !is_dir {
                let lower = name.to_lowercase();
                if [".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg"]
                    .iter()
                    .any(|&e| lower.ends_with(e))
                {
                    images.push(FileNode {
                        name: name.clone(),
                        path: path_str.clone(),
                        is_folder: false,
                        children: None,
                    });
                }
            }

            let children = if is_dir {
                if recursive && depth < 3 {
                    Some(scan_dir(&path_str, images, true, depth + 1))
                } else {
                    Some(vec![])
                }
            } else {
                None
            };
            nodes.push(FileNode {
                name,
                path: path_str,
                is_folder: is_dir,
                children,
            });
        }
    }
    nodes.sort_by(|a, b| {
        if a.is_folder == b.is_folder {
            a.name.cmp(&b.name)
        } else if a.is_folder {
            std::cmp::Ordering::Less
        } else {
            std::cmp::Ordering::Greater
        }
    });
    nodes
}
