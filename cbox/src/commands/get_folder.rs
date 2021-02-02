use std::error::Error;
use std::fs::{self, DirEntry};
use std::io;

use crate::commands::factory::RespondingCommand;
use crate::models::commands::GetFolder as GetFolderModel;
use crate::models::responses::{FolderNode, FolderResponse};
use crate::services::disk_path;

pub struct GetFolder {
    pub model: GetFolderModel,
}

impl RespondingCommand<FolderResponse> for GetFolder {
    fn exec(&self) -> Result<FolderResponse, Box<dyn Error>> {
        let folder_path = disk_path::build(
            self.model.disk_name.clone(),
            vec![self.model.folder_path.clone()],
        );
        let entries = fs::read_dir(&folder_path)?
            .map(|res| {
                res.map(|e| FolderNode {
                    node_type: Self::determine_file_type(&e),
                    name: e.file_name().into_string().unwrap(),
                })
            })
            .collect::<Result<Vec<_>, io::Error>>()?;

        Ok(FolderResponse {
            path: folder_path.to_str().unwrap().to_string(),
            nodes: entries,
        })
    }
}

impl GetFolder {
    fn determine_file_type(e: &DirEntry) -> String {
        if let Ok(metadata) = e.metadata() {
            if metadata.is_dir() {
                "folder".to_string()
            } else {
                "file".to_string()
            }
        } else {
            "unknown".to_string()
        }
    }
}
