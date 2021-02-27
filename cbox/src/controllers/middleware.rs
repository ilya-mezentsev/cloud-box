use crate::controllers::presenter;
use crate::services::auth;

const TOKEN_HEADER_NAME: &str = "X-Box-UUID";
const IGNORE_TOKEN_CHECK_METHOD: &str = "OPTIONS";

pub fn with_cors_headers(r: rouille::Response) -> rouille::Response {
    r
        .with_additional_header("Access-Control-Allow-Origin", "*")
        .with_additional_header(
            "Access-Control-Allow-Headers",
            format!("Bypass-Tunnel-Reminder, Content-Type, Cache-Control, {}", TOKEN_HEADER_NAME),
        )
        .with_additional_header("Access-Control-Request-Method", "GET,POST,PATCH,DELETE,OPTIONS")
}

pub fn can_process(request: &rouille::Request) -> Option<rouille::Response> {
    if request.method() == IGNORE_TOKEN_CHECK_METHOD {
        None
    } else if let Some(uuid_check_failed_response) = check_uuid(request) {
        Some(uuid_check_failed_response)
    } else {
        None
    }
}

fn check_uuid(request: &rouille::Request) -> Option<rouille::Response> {
    let is_match = auth::uuid_is_match(
        request.header(TOKEN_HEADER_NAME).unwrap_or("").to_string()
    );

    if is_match {
        None
    } else {
        Some(presenter::make_unauthorized_response())
    }
}
