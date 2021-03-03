use std::error::Error;
use std::fs::File;

use crate::models::responses::{DefaultOkResponse, ErrorResponse, ErrorResponseData, FileResponse, OkResponse};
use serde::Serialize;

pub fn make_empty_response() -> rouille::Response {
    rouille::Response {
        status_code: 200,
        headers: vec![],
        data: rouille::ResponseBody::empty(),
        upgrade: None,
    }
}

pub fn make_response<T: Serialize>(res: Result<T, Box<dyn Error>>) -> rouille::Response {
    match res {
        Ok(data) => rouille::Response::json(&OkResponse {
            status: String::from("ok"),
            data,
        }),

        Err(err) => rouille::Response::json(&ErrorResponse {
            status: String::from("error"),
            data: ErrorResponseData{
                description: err.to_string(),
            }
        }),
    }
}

pub fn make_default_response(err: Option<Box<dyn Error>>) -> rouille::Response {
    match err {
        Some(err) => rouille::Response::json(&ErrorResponse {
            status: String::from("error"),
            data: ErrorResponseData{
                description: err.to_string(),
            }
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
            data: ErrorResponseData{
                description: err.to_string(),
            }
        }),
    }
}

fn _make_response_from_file(res: FileResponse) -> rouille::Response {
    let file = File::open(&res.file_path);
    match file {
        Ok(f) => rouille::Response::from_file(rouille::extension_to_mime(&res.extension), f),

        Err(err) => rouille::Response::json(&ErrorResponse {
            status: String::from("error"),
            data: ErrorResponseData{
                description: err.to_string(),
            }
        }),
    }
}

pub fn make_missing_param_response(param_name: &str) -> rouille::Response {
    rouille::Response::json(&ErrorResponse {
        status: String::from("error"),
        data: ErrorResponseData{
            description: format!("Param {} is missing", param_name),
        }
    })
}

pub fn make_unauthorized_response() -> rouille::Response {
    rouille::Response {
        status_code: 401,
        headers: vec![],
        data: rouille::ResponseBody::from_string("Unauthorized"),
        upgrade: None,
    }
}
