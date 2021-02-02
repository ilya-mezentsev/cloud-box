use serde::{Deserialize, Serialize};

pub struct CreateFile {
    pub disk_name: String,
    pub folder_path: String,
    pub filename: String,
    pub data: Vec<u8>,
}

pub struct GetFile {
    pub disk_name: String,
    pub file_path: String,
}

#[derive(Deserialize, Serialize)]
pub struct Rename {
    pub disk_name: String,
    pub folder_path: String,
    pub old_name: String,
    pub new_name: String,
}

pub struct DeleteFile {
    pub disk_name: String,
    pub file_path: String,
}

#[derive(Deserialize, Serialize)]
pub struct CreateFolder {
    pub disk_name: String,
    pub root_path: String,
    pub folder_name: String,
}

pub struct GetFolder {
    pub disk_name: String,
    pub folder_path: String,
}

pub struct DeleteFolder {
    pub disk_name: String,
    pub folder_path: String,
}
