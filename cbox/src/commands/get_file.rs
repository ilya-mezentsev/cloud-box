use std::error::Error;
use std::ffi::OsStr;
use std::fs::{File, Metadata};
use std::path::Path;

use crate::commands::factory::RespondingCommand;
use crate::models::commands::GetFile as GetFileModel;
use crate::models::responses::FileResponse;
use crate::services::disk_path;

pub struct GetFile {
    pub model: GetFileModel,
}

impl RespondingCommand<FileResponse> for GetFile {
    fn exec(&self) -> Result<FileResponse, Box<dyn Error>> {
        let file_path = disk_path::build(
            self.model.disk_name.clone(),
            vec![self.model.file_path.clone()],
        );
        let file = File::open(&file_path)?;
        let file_meta = file.metadata()?;
        self.assert_is_file(file_meta)?;

        let mut ext = Path::new(&self.model.file_path)
            .extension()
            .and_then(OsStr::to_str);
        let ext = ext.get_or_insert("").to_string();

        Ok(FileResponse {
            file_path,
            extension: ext,
        })
    }
}

impl GetFile {
    fn assert_is_file(&self, file_meta: Metadata) -> Result<(), String> {
        if file_meta.is_file() {
            Ok(())
        } else {
            Err("Not a file".to_string())
        }
    }
}
