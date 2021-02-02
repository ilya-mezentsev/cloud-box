#[cfg(test)]
mod tests {
    use std::path::Path;

    use crate::controllers::handlers::delete_folder;
    use crate::controllers::tests::utils::utils;
    use crate::models::responses::{DefaultOkResponse, ErrorResponse};

    #[test]
    fn delete_folder_bad_request() {
        let req = rouille::Request::fake_http("DELETE", "localhost:1234", vec![], vec![]);
        let res = delete_folder(&req);

        let (reader, _) = res.data.into_reader_and_size();
        let response_data: ErrorResponse = serde_json::from_reader(reader).unwrap();

        assert_eq!(200, res.status_code);
        assert_eq!("error", response_data.status);
        assert_eq!(
            "Param folder_path or disk_name is missing",
            response_data.description
        );
    }

    #[test]
    fn delete_folder_not_exists() {
        let req = rouille::Request::fake_http(
            "DELETE",
            "localhost:1234?folder_path=foo/bar&disk_name=baz",
            vec![],
            vec![],
        );
        let res = delete_folder(&req);

        let (reader, _) = res.data.into_reader_and_size();
        let response_data: ErrorResponse = serde_json::from_reader(reader).unwrap();

        assert_eq!(200, res.status_code);
        assert_eq!("error", response_data.status);
        assert_eq!(
            "No such file or directory (os error 2)",
            response_data.description
        );
    }

    #[test]
    fn delete_folder_success() {
        let (disk_name, folder_name) = utils::create_tmp_dir();
        assert!(Path::new(&disk_name).join(Path::new(&folder_name)).exists());

        let req = rouille::Request::fake_http(
            "DELETE",
            format!(
                "localhost:1234?folder_path={}&disk_name={}",
                folder_name, disk_name,
            ),
            vec![],
            vec![],
        );
        let res = delete_folder(&req);

        let (reader, _) = res.data.into_reader_and_size();
        let response_data: DefaultOkResponse = serde_json::from_reader(reader).unwrap();

        assert_eq!(200, res.status_code);
        assert_eq!("ok", response_data.status);
    }
}
