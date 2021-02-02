#[cfg(test)]
mod tests {
    use crate::controllers::handlers::get_file;
    use crate::controllers::tests::utils::utils;
    use crate::models::responses::ErrorResponse;

    #[test]
    fn get_file_missing_argument() {
        let req = rouille::Request::fake_http("GET", "localhost:1234", vec![], vec![]);
        let res = get_file(&req);

        let (reader, _) = res.data.into_reader_and_size();
        let err: ErrorResponse = serde_json::from_reader(reader).unwrap();

        assert_eq!(200, res.status_code);
        assert_eq!("error", err.status);
        assert_eq!("Param file_path or disk_name is missing", err.description);
    }

    #[test]
    fn get_file_not_exists() {
        let req = rouille::Request::fake_http(
            "GET",
            "localhost:1234?file_path=/foo/bar/baz.txt&disk_name=bar",
            vec![],
            vec![],
        );
        let res = get_file(&req);

        let (reader, _) = res.data.into_reader_and_size();
        let err: ErrorResponse = serde_json::from_reader(reader).unwrap();

        assert_eq!(200, res.status_code);
        assert_eq!("error", err.status);
        assert_eq!("No such file or directory (os error 2)", err.description);
    }

    #[test]
    fn get_file_success() {
        let (disk_name, path, expected_content) = utils::create_tmp_file();
        let req = rouille::Request::fake_http(
            "GET",
            format!("localhost:1234?file_path={}&disk_name={}", path, disk_name),
            vec![],
            vec![],
        );
        let res = get_file(&req);

        let (mut reader, _) = res.data.into_reader_and_size();
        let mut content = String::new();
        reader.read_to_string(&mut content).unwrap();

        assert_eq!(200, res.status_code);
        assert_eq!(expected_content, content);

        // content-type header check
        assert!(res.headers.get(0).unwrap().1.contains("text/plain"));
    }
}
