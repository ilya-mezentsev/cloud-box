#[cfg(test)]
pub mod utils {
    use std::env;
    use std::fs;
    use std::fs::File;
    use std::io::Write;

    use uuid;

    use crate::services::disk_path;

    fn set_devices_mount_root(temp_dir: String) {
        env::set_var("DEVICES_MOUNT_ROOT", temp_dir);
    }

    pub fn set_home_dir_as_devices_mount_root() {
        self::set_devices_mount_root("/home".to_string());
    }

    pub fn set_random_string_as_devices_mount_root() {
        self::set_devices_mount_root(uuid::Uuid::new_v4().to_string());
    }

    pub fn create_tmp_file() -> (String, String, String) {
        let temp_dir = env::temp_dir();
        let temp_dir = temp_dir.to_str().unwrap();

        set_devices_mount_root(temp_dir.to_string());

        let filename = format!("{}.txt", uuid::Uuid::new_v4().to_string());
        let my_file_path = disk_path::build(temp_dir.to_string(), vec![filename.clone()]);
        let str_for_file = String::from("Hello world\n");

        let mut file = File::create(&my_file_path).unwrap();
        file.write_all(str_for_file.as_bytes()).unwrap();

        (temp_dir.to_string(), filename, str_for_file)
    }

    pub fn create_tmp_dir() -> (String, String) {
        let temp_dir = env::temp_dir();
        let temp_dir = temp_dir.to_str().unwrap();

        set_devices_mount_root(temp_dir.to_string());

        let folder_name = uuid::Uuid::new_v4().to_string();
        let my_dir_name = disk_path::build(temp_dir.to_string(), vec![folder_name.clone()]);

        fs::create_dir(&my_dir_name).unwrap();
        let mut p = my_dir_name.metadata().unwrap().permissions();
        p.set_readonly(false);
        fs::set_permissions(&my_dir_name, p).unwrap();

        (temp_dir.to_string(), folder_name)
    }

    pub fn new_filename(filename: String) -> String {
        format!("new-{}", filename)
    }

    pub fn new_folder_name(fold_name: String) -> String {
        self::new_filename(fold_name)
    }

    pub fn random_folder_name() -> String {
        uuid::Uuid::new_v4().to_string()
    }

    pub fn disk_name() -> String {
        env::temp_dir().to_str().unwrap().to_string()
    }
}
