use std::error::Error;
use std::fs::File;
use std::io::Write;

use crate::commands::factory::SilentCommand;
use crate::models::commands::CreateFile as CreateFileModel;
use crate::services::disk_path;

pub struct CreateFile {
    pub model: CreateFileModel,
}

impl SilentCommand for CreateFile {
    fn exec(self) -> Option<Box<dyn Error>> {
        let my_file_path = disk_path::build(
            self.model.disk_name,
            vec![self.model.folder_path, self.model.filename],
        );

        let mut file = File::create(my_file_path).ok()?;
        match file.write_all(self.model.data.as_ref()) {
            Ok(_) => None,

            Err(err) => Some(Box::new(err)),
        }
    }
}
