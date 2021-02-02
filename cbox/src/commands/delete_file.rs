use std::error::Error;
use std::fs;

use crate::commands::factory::SilentCommand;
use crate::models::commands::DeleteFile as DeleteFileModel;
use crate::services::disk_path;

pub struct DeleteFile {
    pub model: DeleteFileModel,
}

impl SilentCommand for DeleteFile {
    fn exec(self) -> Option<Box<dyn Error>> {
        match fs::remove_file(disk_path::build(
            self.model.disk_name,
            vec![self.model.file_path],
        )) {
            Ok(_) => None,

            Err(err) => Some(Box::new(err)),
        }
    }
}
