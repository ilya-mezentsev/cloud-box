use std::fs::File;
use std::io::prelude::*;
use std::error::Error;

use log::error;

use crate::settings::env;

pub fn uuid_is_match(uuid: String) -> bool {
    match _uuid_is_match(uuid) {
        Ok(is_match) => is_match,

        Err(e) => {
            error!("Unable to check uuid matching: {:?}", e);

            false
        },
    }
}

fn _uuid_is_match(uuid: String) -> Result<bool, Box<dyn Error>> {
    let box_uuid_file_path = env::box_uuid_file_path();
    match box_uuid_file_path {
        Some(path) => {
            let mut file = File::open(path)?;
            let mut content = String::new();
            file.read_to_string(&mut content)?;

            Ok(content.trim() == uuid)
        },

        None => Ok(false)
    }
}
