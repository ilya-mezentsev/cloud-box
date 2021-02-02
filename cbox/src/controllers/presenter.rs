use std::error::Error;
use std::fs::File;

use crate::models::responses::{DefaultOkResponse, ErrorResponse, FileResponse, OkResponse};
use serde::Serialize;

pub fn make_response<T: Serialize>(res: Result<T, Box<dyn Error>>) -> rouille::Response {
    match res {
        Ok(data) => rouille::Response::json(&OkResponse {
            status: String::from("ok"),
            data,
        }),

        Err(e) => rouille::Response::json(&ErrorResponse {
            status: String::from("error"),
            description: e.to_string(),
        }),
    }
}

pub fn make_default_response(err: Option<Box<dyn Error>>) -> rouille::Response {
    match err {
        Some(e) => rouille::Response::json(&ErrorResponse {
            status: String::from("error"),
            description: e.to_string(),
        }),

        None => rouille::Response::json(&DefaultOkResponse {
            status: String::from("ok"),
        }),
    }
}

pub fn make_response_from_file(res: Result<FileResponse, Box<dyn Error>>) -> rouille::Response {
    match res {
        Ok(fr) => _make_response_from_file(fr),

        Err(err) => rouille::Response::json(&ErrorResponse {
            status: String::from("error"),
            description: err.to_string(),
        }),
    }
}

fn _make_response_from_file(res: FileResponse) -> rouille::Response {
    let file = File::open(&res.file_path);
    match file {
        Ok(f) => rouille::Response::from_file(rouille::extension_to_mime(&res.extension), f),

        Err(err) => rouille::Response::json(&ErrorResponse {
            status: String::from("error"),
            description: err.to_string(),
        }),
    }
}

pub fn make_missing_param_response(param_name: &str) -> rouille::Response {
    rouille::Response::json(&ErrorResponse {
        status: String::from("error"),
        description: format!("Param {} is missing", param_name),
    })
}
