
use crate::fs::FileNode;
use bincode::{config, decode_from_slice, encode_to_vec};
use std::path::Path;

pub fn flatten_tree(nodes: Vec<FileNode>) -> Vec<FileNode> {
    let mut flat = Vec::new();
    for mut n in nodes {
        let c = n.children.take(); flat.push(n);
        if let Some(l) = c { flat.extend(flatten_tree(l)); }
    }
    flat
}

pub fn store_node(meta: &sled::Tree, hier: &sled::Tree, n: FileNode) -> Result<(), String> {
    let p = n.path.clone();
    meta.insert(&p, encode_to_vec(&n, config::standard()).unwrap()).unwrap();
    if let Some(par) = Path::new(&p).parent().and_then(|p| p.to_str()) {
        let mut c: Vec<String> = hier.get(par).unwrap().map(|v| decode_from_slice(&v, config::standard()).unwrap().0).unwrap_or_default();
        if !c.contains(&p) { 
            c.push(p.clone()); 
            hier.insert(par, encode_to_vec(&c, config::standard()).unwrap()).unwrap(); 
        }
    }
    Ok(())
}
