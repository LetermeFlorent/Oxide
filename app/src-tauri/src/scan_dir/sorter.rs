
use crate::fs::models::FileNode;
use std::cmp::Ordering;

pub fn sort_nodes(nodes: &mut Vec<FileNode>) {
    nodes.sort_by(|a, b| {
        if a.is_folder != b.is_folder {
            if a.is_folder { Ordering::Less } else { Ordering::Greater }
        } else {
            a.name.to_lowercase().cmp(&b.name.to_lowercase())
        }
    });
}
