#[cfg(test)]
mod tests {
    use crate::controllers::handlers::get_disks;
    use crate::controllers::tests::utils::utils;
    use crate::models::responses::{DisksResponse, ErrorResponse, OkResponse};

    #[test]
    fn get_disks_success() {
        utils::set_home_dir_as_devices_mount_root();

        let res = get_disks();
        let (reader, _) = res.data.into_reader_and_size();
        let response: OkResponse<DisksResponse> = serde_json::from_reader(reader).unwrap();

        assert_eq!(200, res.status_code);
        assert_eq!("ok", response.status);
        assert!(response.data.disks.len() > 0);
    }

    #[test]
    fn get_disks_bad_devices_mount_root() {
        utils::set_random_string_as_devices_mount_root();

        let res = get_disks();
        let (reader, _) = res.data.into_reader_and_size();
        let err: ErrorResponse = serde_json::from_reader(reader).unwrap();

        assert_eq!(200, res.status_code);
        assert_eq!("error", err.status);
        assert_eq!("No such file or directory (os error 2)", err.description);
    }
}
