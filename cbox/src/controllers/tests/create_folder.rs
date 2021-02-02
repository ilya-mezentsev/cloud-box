#[cfg(test)]
mod tests {
    use std::path::Path;

    use crate::controllers::handlers::create_folder;
    use crate::controllers::tests::utils::utils;
    use crate::models::commands::CreateFolder;
    use crate::models::responses::{DefaultOkResponse, ErrorResponse};

    #[test]
    fn create_folder_bad_request() {
        let req = rouille::Request::fake_http("POST", "localhost:1234", vec![], vec![]);
        let res = create_folder(&req);

        assert_eq!(400, res.status_code);
    }

    #[test]
    fn create_folder_already_exists() {
        let (disk_name, folder_name) = utils::create_tmp_dir();
        let req_body = serde_json::to_string(&CreateFolder {
            disk_name,
            root_path: "".to_string(),
            folder_name,
        })
        .unwrap();
        let req = rouille::Request::fake_http(
            "POST",
            "localhost:1234",
            vec![("Content-Type".to_string(), "application/json".to_string())],
            Vec::from(req_body.as_bytes()),
        );
        let res = create_folder(&req);

        let (reader, _) = res.data.into_reader_and_size();
        let response_data: ErrorResponse = serde_json::from_reader(reader).unwrap();

        assert_eq!(200, res.status_code);
        assert_eq!("error", response_data.status);
        assert_eq!("File exists (os error 17)", response_data.description);
    }

    #[test]
    fn create_folder_success() {
        let disk_name = utils::disk_name();
        let folder_name = utils::random_folder_name();
        let req_body = serde_json::to_string(&CreateFolder {
            disk_name: disk_name.clone(),
            root_path: "".to_string(),
            folder_name: folder_name.clone(),
        })
        .unwrap();
        let req = rouille::Request::fake_http(
            "POST",
            "localhost:1234",
            vec![("Content-Type".to_string(), "application/json".to_string())],
            Vec::from(req_body.as_bytes()),
        );
        let res = create_folder(&req);

        let (reader, _) = res.data.into_reader_and_size();
        let response_data: DefaultOkResponse = serde_json::from_reader(reader).unwrap();

        assert_eq!(200, res.status_code);
        assert_eq!("ok", response_data.status);
        assert!(Path::new(&disk_name).join(Path::new(&folder_name)).exists());
    }
}
