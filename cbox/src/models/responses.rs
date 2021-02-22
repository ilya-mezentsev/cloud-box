use serde::{Deserialize, Serialize};
use std::path::PathBuf;

#[derive(Serialize, Deserialize)]
pub struct DefaultOkResponse {
    pub status: String,
}

#[derive(Serialize, Deserialize)]
pub struct OkResponse<T: Serialize> {
    pub status: String,
    pub data: T,
}

#[derive(Serialize, Deserialize)]
pub struct ErrorResponse {
    pub status: String,
    pub data: ErrorResponseData,
}

#[derive(Serialize, Deserialize)]
pub struct ErrorResponseData {
    pub description: String,
}

pub struct FileResponse {
    pub file_path: PathBuf,
    pub extension: String,
}

#[derive(Serialize, Deserialize)]
pub struct DisksResponse {
    pub disks: Vec<String>,
}

#[derive(Serialize, Deserialize)]
pub struct FolderResponse {
    pub path: String,
    pub nodes: Vec<FolderNode>,
}

#[derive(Serialize, Deserialize)]
pub struct FolderNode {
    pub node_type: String,
    pub name: String,
}
