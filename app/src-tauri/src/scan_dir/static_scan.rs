
use crate::fs::FileNode;
use crate::scan_dir::filters::{is_ignored, is_image};
use crate::scan_dir::sorter::sort_nodes;
use std::fs;
use rayon::prelude::*;
use std::sync::{Arc, Mutex};

pub fn scan_dir(dir_path: &str, images: &mut Vec<FileNode>, recursive: bool, depth: u32) -> Vec<FileNode> {
    if depth > 5 { return vec![]; } // Increased depth
    
    let entries: Vec<_> = match fs::read_dir(dir_path) {
        Ok(e) => e.flatten().collect(),
        Err(_) => return vec![],
    };

    let shared_images = Arc::new(Mutex::new(Vec::new()));
    
    let mut nodes: Vec<FileNode> = entries.par_iter().map(|entry| {
        let path = entry.path();
        let name = entry.file_name().to_string_lossy().to_string();
        let is_dir = path.is_dir();
        let path_str = path.to_string_lossy().to_string();
        
        if is_dir && is_ignored(&name) {
            return FileNode { name, path: path_str, is_folder: true, children: Some(vec![]) };
        }
        
        if !is_dir && is_image(&name) {
            let mut imgs = shared_images.lock().unwrap();
            imgs.push(FileNode { name: name.clone(), path: path_str.clone(), is_folder: false, children: None });
        }
        
        let children = if is_dir {
            if recursive && depth < 4 { // Increased recursion depth
                let mut sub_images = Vec::new();
                let sub_nodes = scan_dir(&path_str, &mut sub_images, true, depth + 1);
                let mut global_imgs = shared_images.lock().unwrap();
                global_imgs.extend(sub_images);
                Some(sub_nodes)
            } else {
                Some(vec![])
            }
        } else {
            None
        };
        
        FileNode { name, path: path_str, is_folder: is_dir, children }
    }).collect();

    // Merge collected images
    if let Ok(imgs) = Arc::try_unwrap(shared_images) {
        images.extend(imgs.into_inner().unwrap());
    }

    sort_nodes(&mut nodes);
    nodes
}
