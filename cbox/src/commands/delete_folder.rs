use std::error::Error;
use std::fs;

use crate::commands::factory::SilentCommand;
use crate::models::commands::DeleteFolder as DeleteFolderModel;
use crate::services::disk_path;

pub struct DeleteFolder {
    pub model: DeleteFolderModel,
}

impl SilentCommand for DeleteFolder {
    fn exec(self) -> Option<Box<dyn Error>> {
        match fs::remove_dir_all(disk_path::build(
            self.model.disk_name,
            vec![self.model.folder_path],
        )) {
            Ok(_) => None,

            Err(err) => Some(Box::new(err)),
        }
    }
}
