use std::error::Error;

use crate::commands::{
    create_file::CreateFile, create_folder::CreateFolder, delete_file::DeleteFile,
    delete_folder::DeleteFolder, get_disks::GetDisks, get_file::GetFile, get_folder::GetFolder,
    rename::Rename,
};
use crate::decorators::commands_loggers::{
    RespondingCommandLoggerDecorator, SilentCommandsLoggerDecorator,
};
use crate::models::commands::{
    CreateFile as CreateFileModel, CreateFolder as CreateFolderModel,
    DeleteFile as DeleteFileModel, DeleteFolder as DeleteFolderModel, GetFile as GetFileModel,
    GetFolder as GetFolderModel, Rename as RenameModel,
};
use crate::models::responses::{DisksResponse, FileResponse, FolderResponse};

pub trait SilentCommand {
    fn exec(self) -> Option<Box<dyn Error>>;
}

pub trait RespondingCommand<T> {
    fn exec(&self) -> Result<T, Box<dyn Error>>;
}

pub struct CommandFactory;

impl CommandFactory {
    pub fn get_disks() -> impl RespondingCommand<DisksResponse> {
        RespondingCommandLoggerDecorator {
            command: Box::new(GetDisks {}),
        }
    }

    pub fn create_file(model: CreateFileModel) -> impl SilentCommand {
        SilentCommandsLoggerDecorator {
            command: CreateFile { model },
        }
    }

    pub fn get_file(model: GetFileModel) -> impl RespondingCommand<FileResponse> {
        RespondingCommandLoggerDecorator {
            command: Box::new(GetFile { model }),
        }
    }

    pub fn rename(model: RenameModel) -> impl SilentCommand {
        SilentCommandsLoggerDecorator {
            command: Rename { model },
        }
    }

    pub fn delete_file(model: DeleteFileModel) -> impl SilentCommand {
        SilentCommandsLoggerDecorator {
            command: DeleteFile { model },
        }
    }

    pub fn get_folder(model: GetFolderModel) -> impl RespondingCommand<FolderResponse> {
        RespondingCommandLoggerDecorator {
            command: Box::new(GetFolder { model }),
        }
    }

    pub fn create_folder(model: CreateFolderModel) -> impl SilentCommand {
        SilentCommandsLoggerDecorator {
            command: CreateFolder { model },
        }
    }

    pub fn delete_folder(model: DeleteFolderModel) -> impl SilentCommand {
        SilentCommandsLoggerDecorator {
            command: DeleteFolder { model },
        }
    }
}
