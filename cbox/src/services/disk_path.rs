use std::path::{Path, PathBuf};

use whoami;

use crate::settings::env;

pub fn build(disk_name: String, path_components: Vec<String>) -> PathBuf {
    let disk_path = mounting_devices_root_path().join(Path::new(&disk_name));

    let mut absolute_path = disk_path;
    for component in path_components.iter().map(|p| clean_path(p.clone())) {
        absolute_path = absolute_path.join(Path::new(&component));
    }

    absolute_path
}

pub fn mounting_devices_root_path() -> PathBuf {
    let devices_mount_root = env::devices_mount_root();
    let username = whoami::username();

    Path::new(&devices_mount_root).join(Path::new(&username))
}

fn clean_path(p: String) -> String {
    let mut cleaned = p.clone();
    while cleaned.starts_with("/") {
        cleaned = cleaned.strip_prefix("/").unwrap().to_string();
    }

    cleaned
}
