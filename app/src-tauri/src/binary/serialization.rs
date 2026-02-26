
use crate::fs::FileNode;

fn serialize_node(n: &FileNode, buf: &mut Vec<u8>) {
    let (n_b, p_b) = (n.name.as_bytes(), n.path.as_bytes());
    let c_c = n.children.as_ref().map(|c| c.len()).unwrap_or(0) as u32;
    buf.push(if n.is_folder { 1 } else { 0 });
    buf.extend_from_slice(&(n_b.len() as u32).to_le_bytes());
    buf.extend_from_slice(&(p_b.len() as u32).to_le_bytes());
    buf.extend_from_slice(&c_c.to_le_bytes());
    buf.extend_from_slice(n_b); buf.extend_from_slice(p_b);
    if let Some(cl) = n.children.as_ref() { for c in cl { serialize_node(c, buf); } }
}

pub fn serialize_tree_binary(t: &[FileNode], i: &[FileNode]) -> Vec<u8> {
    let mut b = Vec::with_capacity((t.len() + i.len()) * 128);
    b.extend_from_slice(&(t.len() as u32).to_le_bytes());
    for n in t { serialize_node(n, &mut b); }
    b.extend_from_slice(&(i.len() as u32).to_le_bytes());
    for n in i { serialize_node(n, &mut b); }
    b
}
