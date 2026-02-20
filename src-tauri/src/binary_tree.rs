use crate::fs::FileNode;
use crate::scan_dir;

/**
 * Binary Tree Protocol
 * Layout per node:
 * [1 byte: is_folder]
 * [4 bytes: name_len (LE)]
 * [4 bytes: path_len (LE)]
 * [4 bytes: children_count (LE)]
 * [N bytes: name (UTF-8)]
 * [M bytes: path (UTF-8)]
 * [Nodes...: children recursively]
 */

#[tauri::command]
pub async fn scan_project_binary(path: String, recursive: Option<bool>) -> Result<Vec<u8>, String> {
    let rec = recursive.unwrap_or(false);
    tauri::async_runtime::spawn_blocking(move || {
        let mut images = Vec::new();
        let tree = scan_dir::scan_dir(&path, &mut images, rec, 0);
        Ok(serialize_tree_binary(&tree, &images))
    })
    .await
    .map_err(|e| e.to_string())?
}

pub fn serialize_tree_binary(tree: &[FileNode], images: &[FileNode]) -> Vec<u8> {
    let mut buffer = Vec::with_capacity((tree.len() + images.len()) * 128);

    // 1. Tree Section
    buffer.extend_from_slice(&(tree.len() as u32).to_le_bytes());
    for node in tree {
        serialize_node(node, &mut buffer);
    }

    // 2. Images Section
    buffer.extend_from_slice(&(images.len() as u32).to_le_bytes());
    for node in images {
        serialize_node(node, &mut buffer);
    }

    buffer
}

fn serialize_node(node: &FileNode, buffer: &mut Vec<u8>) {
    let is_folder = if node.is_folder { 1u8 } else { 0u8 };
    let name_bytes = node.name.as_bytes();
    let path_bytes = node.path.as_bytes();
    let children = node.children.as_ref();
    let children_count = children.map(|c| c.len()).unwrap_or(0) as u32;

    buffer.push(is_folder);
    buffer.extend_from_slice(&(name_bytes.len() as u32).to_le_bytes());
    buffer.extend_from_slice(&(path_bytes.len() as u32).to_le_bytes());
    buffer.extend_from_slice(&children_count.to_le_bytes());
    buffer.extend_from_slice(name_bytes);
    buffer.extend_from_slice(path_bytes);

    if let Some(children_list) = children {
        for child in children_list {
            serialize_node(child, buffer);
        }
    }
}
