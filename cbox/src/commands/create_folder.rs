use std::error::Error;
use std::fs;

use crate::commands::factory::SilentCommand;
use crate::models::commands::CreateFolder as CreateFolderModel;
use crate::services::disk_path;

pub struct CreateFolder {
    pub model: CreateFolderModel,
}

impl SilentCommand for CreateFolder {
    fn exec(self) -> Option<Box<dyn Error>> {
        let new_folder_path = disk_path::build(
            self.model.disk_name,
            vec![self.model.root_path, self.model.folder_name],
        );

        match fs::create_dir(new_folder_path) {
            Ok(_) => None,

            Err(err) => Some(Box::new(err)),
        }
    }
}
