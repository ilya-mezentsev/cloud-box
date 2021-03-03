use std::env;

use log::error;

const DEFAULT_DEVICES_MOUNT_ROOT: &str = "/media";
const DEFAULT_SERVER_ADDRESS: &str = "localhost:8080";

pub fn server_address() -> String {
    env::var("SERVER_ADDRESS").unwrap_or(DEFAULT_SERVER_ADDRESS.to_string())
}

pub fn devices_mount_root() -> String {
    env::var("DEVICES_MOUNT_ROOT").unwrap_or(DEFAULT_DEVICES_MOUNT_ROOT.to_string())
}

pub fn box_uuid_file_path() -> Option<String> {
    match env::var("BOX_UUID_FILE") {
        Ok(file_path) => Some(file_path),

        Err(_) => {
            error!("BOX_UUID_FILE is not set!");

            None
        }
    }
}
