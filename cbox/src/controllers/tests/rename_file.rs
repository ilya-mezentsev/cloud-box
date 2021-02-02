#[cfg(test)]
mod test {
    use std::path::Path;

    use crate::controllers::handlers::rename;
    use crate::controllers::tests::utils::utils;
    use crate::models::commands::Rename;
    use crate::models::responses::{DefaultOkResponse, ErrorResponse};

    #[test]
    fn rename_file_bad_request() {
        let req = rouille::Request::fake_http("PATCH", "localhost:1234", vec![], vec![]);
        let res = rename(&req);

        assert_eq!(400, res.status_code);
    }

    #[test]
    fn rename_file_not_exists() {
        let req_body = serde_json::to_string(&Rename {
            disk_name: "foo".to_string(),
            folder_path: "bar".to_string(),
            old_name: "old.txt".to_string(),
            new_name: "new.txt".to_string(),
        })
        .unwrap();
        let req = rouille::Request::fake_http(
            "PATCH",
            "localhost:1234",
            vec![("Content-Type".to_string(), "application/json".to_string())],
            Vec::from(req_body.as_bytes()),
        );
        let res = rename(&req);

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
    fn rename_file_success() {
        let (disk_name, filename, _) = utils::create_tmp_file();
        let new_filename = utils::new_filename(filename.clone());

        assert!(Path::new(&disk_name).join(Path::new(&filename)).exists());

        let req_body = serde_json::to_string(&Rename {
            disk_name: disk_name.clone(),
            folder_path: "".to_string(),
            old_name: filename.clone(),
            new_name: new_filename.clone(),
        })
        .unwrap();
        let req = rouille::Request::fake_http(
            "PATCH",
            "localhost:1234",
            vec![("Content-Type".to_string(), "application/json".to_string())],
            Vec::from(req_body.as_bytes()),
        );
        let res = rename(&req);

        let (reader, _) = res.data.into_reader_and_size();
        let response_data: DefaultOkResponse = serde_json::from_reader(reader).unwrap();

        assert_eq!(200, res.status_code);
        assert_eq!("ok", response_data.status);
        assert!(!Path::new(&disk_name).join(Path::new(&filename)).exists());
        assert!(Path::new(&disk_name)
            .join(Path::new(&new_filename))
            .exists());
    }
}
