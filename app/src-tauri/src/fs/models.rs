
use bincode::{Decode, Encode};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone, Encode, Decode)]
pub struct FilePatch {
    pub project_id: String,
    pub parent_path: String,
    pub added: Vec<FileNode>,
    pub removed: Vec<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone, Encode, Decode)]
pub struct FileNode {
    pub name: String,
    pub path: String,
    #[serde(rename = "isFolder")]
    pub is_folder: bool,
    pub children: Option<Vec<FileNode>>,
}

#[derive(Debug, Serialize, Deserialize, Encode, Decode)]
pub struct ScanResult {
    pub tree: Vec<FileNode>,
    pub images: Vec<FileNode>,
}
