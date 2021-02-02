#[cfg(test)]
mod tests {
    use std::path::Path;

    use crate::controllers::handlers::get_folder;
    use crate::controllers::tests::utils::utils;
    use crate::models::responses::{ErrorResponse, FolderResponse, OkResponse};

    #[test]
    fn get_folder_missing_argument() {
        let req = rouille::Request::fake_http("GET", "localhost:1234", vec![], vec![]);
        let res = get_folder(&req);

        let (reader, _) = res.data.into_reader_and_size();
        let err: ErrorResponse = serde_json::from_reader(reader).unwrap();

        assert_eq!(200, res.status_code);
        assert_eq!("error", err.status);
        assert_eq!("Param folder_path or disk_name is missing", err.description);
    }

    #[test]
    fn get_folder_not_exists() {
        let req = rouille::Request::fake_http(
            "GET",
            "localhost:1234?folder_path=foo/bar&disk_name=baz",
            vec![],
            vec![],
        );
        let res = get_folder(&req);

        let (reader, _) = res.data.into_reader_and_size();
        let err: ErrorResponse = serde_json::from_reader(reader).unwrap();

        assert_eq!(200, res.status_code);
        assert_eq!("error", err.status);
        assert_eq!("No such file or directory (os error 2)", err.description);
    }

    #[test]
    fn get_folder_success() {
        let (disk_name, filename, _) = utils::create_tmp_file();
        let req = rouille::Request::fake_http(
            "GET",
            format!("localhost:1234?folder_path=&disk_name={}", disk_name),
            vec![],
            vec![],
        );
        let res = get_folder(&req);

        let (reader, _) = res.data.into_reader_and_size();
        let response: OkResponse<FolderResponse> = serde_json::from_reader(reader).unwrap();

        assert_eq!(200, res.status_code);
        assert_eq!("ok", response.status);
        assert_eq!(
            Path::new(&disk_name)
                .join(Path::new(""))
                .to_str()
                .unwrap()
                .to_string(),
            response.data.path,
        );
        assert!(response
            .data
            .nodes
            .iter()
            .find(|n| n.name == filename)
            .is_some());
    }
}
