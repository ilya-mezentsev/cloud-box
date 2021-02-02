use std::error::Error;
use std::fs;

use crate::commands::factory::SilentCommand;
use crate::models::commands::Rename as RenameModel;
use crate::services::disk_path;

pub struct Rename {
    pub model: RenameModel,
}

impl SilentCommand for Rename {
    fn exec(self) -> Option<Box<dyn Error>> {
        let old_name = disk_path::build(
            self.model.disk_name.clone(),
            vec![self.model.folder_path.clone(), self.model.old_name],
        );
        let new_name = disk_path::build(
            self.model.disk_name.clone(),
            vec![self.model.folder_path.clone(), self.model.new_name],
        );

        match fs::rename(old_name, new_name) {
            Ok(_) => None,

            Err(err) => Some(Box::new(err)),
        }
    }
}
