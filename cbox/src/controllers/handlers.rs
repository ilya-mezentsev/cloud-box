use crate::commands::factory::{CommandFactory, RespondingCommand, SilentCommand};
use crate::controllers::presenter;
use crate::models::commands::{
    CreateFile, CreateFolder, DeleteFile, DeleteFolder, GetFile, GetFolder, Rename,
};

pub fn server_options() -> rouille::Response {
    presenter::make_empty_response()
}

pub fn get_disks() -> rouille::Response {
    presenter::make_response(CommandFactory::get_disks().exec())
}

pub fn get_file(req: &rouille::Request) -> rouille::Response {
    match (req.get_param("file_path"), req.get_param("disk_name")) {
        (Some(file_path), Some(disk_name)) => presenter::make_response_from_file(
            CommandFactory::get_file(GetFile {
                file_path,
                disk_name,
            })
            .exec(),
        ),

        _ => presenter::make_missing_param_response("file_path or disk_name"),
    }
}

pub fn create_file(req: &rouille::Request) -> rouille::Response {
    let input = try_or_400!(post_input!(req, {
        disk_name: String,
        folder_path: String,
        file: rouille::input::post::BufferedFile,
    }));

    match input.file.filename {
        Some(filename) => {
            let res = CommandFactory::create_file(CreateFile {
                folder_path: input.folder_path,
                data: input.file.data,
                disk_name: input.disk_name,
                filename,
            })
            .exec();

            presenter::make_default_response(res)
        }

        None => presenter::make_missing_param_response("file.name"),
    }
}

pub fn rename(req: &rouille::Request) -> rouille::Response {
    let model: Rename = try_or_400!(rouille::input::json_input(req));

    presenter::make_default_response(CommandFactory::rename(model).exec())
}

pub fn delete_file(req: &rouille::Request) -> rouille::Response {
    match (req.get_param("file_path"), req.get_param("disk_name")) {
        (Some(file_path), Some(disk_name)) => presenter::make_default_response(
            CommandFactory::delete_file(DeleteFile {
                file_path,
                disk_name,
            })
            .exec(),
        ),

        _ => presenter::make_missing_param_response("file_path or disk_name"),
    }
}

pub fn create_folder(req: &rouille::Request) -> rouille::Response {
    let model: CreateFolder = try_or_400!(rouille::input::json_input(req));

    presenter::make_default_response(CommandFactory::create_folder(model).exec())
}

pub fn get_folder(req: &rouille::Request) -> rouille::Response {
    match (req.get_param("folder_path"), req.get_param("disk_name")) {
        (Some(folder_path), Some(disk_name)) => presenter::make_response(
            CommandFactory::get_folder(GetFolder {
                folder_path,
                disk_name,
            })
            .exec(),
        ),

        _ => presenter::make_missing_param_response("folder_path or disk_name"),
    }
}

pub fn delete_folder(req: &rouille::Request) -> rouille::Response {
    match (req.get_param("folder_path"), req.get_param("disk_name")) {
        (Some(folder_path), Some(disk_name)) => presenter::make_default_response(
            CommandFactory::delete_folder(DeleteFolder {
                folder_path,
                disk_name,
            })
            .exec(),
        ),

        _ => presenter::make_missing_param_response("folder_path or disk_name"),
    }
}
