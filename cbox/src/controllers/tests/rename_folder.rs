// here only one test function coz this handler is already tested in rename_file.rs

#[cfg(test)]
mod tests {
    use std::path::Path;

    use crate::controllers::handlers::rename;
    use crate::controllers::tests::utils::utils;
    use crate::models::commands::Rename;
    use crate::models::responses::DefaultOkResponse;

    #[test]
    fn rename_folder_success() {
        let (disk_name, folder_name) = utils::create_tmp_dir();
        let new_folder_name = utils::new_folder_name(folder_name.clone());

        assert!(Path::new(&disk_name).join(Path::new(&folder_name)).exists());

        let req_body = serde_json::to_string(&Rename {
            disk_name: disk_name.clone(),
            folder_path: "".to_string(),
            old_name: folder_name.clone(),
            new_name: new_folder_name.clone(),
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
        assert!(!Path::new(&disk_name).join(Path::new(&folder_name)).exists());
        assert!(Path::new(&disk_name)
            .join(Path::new(&new_folder_name))
            .exists());
    }
}
