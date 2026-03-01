
use crate::fs::FileNode;
use crate::scan_dir::filters::{is_ignored, is_image};
use crate::scan_dir::sorter::sort_nodes;
use std::fs;

pub fn scan_dir(dir_path: &str, images: &mut Vec<FileNode>, recursive: bool, depth: u32) -> Vec<FileNode> {
    if depth > 3 { return vec![]; }
    let mut nodes = Vec::new();
    if let Ok(entries) = fs::read_dir(dir_path) {
        for entry in entries.flatten().take(500) {
            let path = entry.path();
            let name = entry.file_name().to_string_lossy().to_string();
            let is_dir = path.is_dir();
            let path_str = path.to_string_lossy().to_string();
            if is_dir && is_ignored(&name) {
                nodes.push(FileNode { name, path: path_str, is_folder: true, children: Some(vec![]) });
                continue;
            }
            if !is_dir && is_image(&name) {
                images.push(FileNode { name: name.clone(), path: path_str.clone(), is_folder: false, children: None });
            }
            let children = if is_dir {
                if recursive && depth < 2 { Some(scan_dir(&path_str, images, true, depth + 1)) } else { Some(vec![]) }
            } else { None };
            nodes.push(FileNode { name, path: path_str, is_folder: is_dir, children });
        }
    }
    sort_nodes(&mut nodes);
    nodes
}
