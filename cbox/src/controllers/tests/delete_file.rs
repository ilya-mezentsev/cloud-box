#[cfg(test)]
mod tests {
    use std::path::Path;

    use crate::controllers::handlers::delete_file;
    use crate::controllers::tests::utils::utils;
    use crate::models::responses::{DefaultOkResponse, ErrorResponse};

    #[test]
    fn delete_file_missing_argument() {
        let req = rouille::Request::fake_http("DELETE", "localhost:1234", vec![], vec![]);
        let res = delete_file(&req);

        let (reader, _) = res.data.into_reader_and_size();
        let err: ErrorResponse = serde_json::from_reader(reader).unwrap();

        assert_eq!(200, res.status_code);
        assert_eq!("error", err.status);
        assert_eq!("Param file_path or disk_name is missing", err.description);
    }

    #[test]
    fn delete_file_not_exists() {
        let req = rouille::Request::fake_http(
            "DELETE",
            "localhost:1234?file_path=/foo/bar/baz.txt&disk_name=bar",
            vec![],
            vec![],
        );
        let res = delete_file(&req);

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
    fn delete_file_success() {
        let (disk_name, filename, _) = utils::create_tmp_file();

        assert!(Path::new(&disk_name).join(Path::new(&filename)).exists());

        let req = rouille::Request::fake_http(
            "DELETE",
            format!(
                "localhost:1234?file_path={}&disk_name={}",
                filename, disk_name
            ),
            vec![],
            vec![],
        );
        let res = delete_file(&req);
        let (reader, _) = res.data.into_reader_and_size();
        let response_data: DefaultOkResponse = serde_json::from_reader(reader).unwrap();

        assert_eq!(200, res.status_code);
        assert_eq!("ok", response_data.status);
        assert!(!Path::new(&disk_name).join(Path::new(&filename)).exists());
    }
}
