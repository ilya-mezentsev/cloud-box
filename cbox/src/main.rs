#![allow(deprecated)] // coz of try! in rouille::post_input!
#[macro_use]
extern crate rouille;

mod commands;
mod controllers;
mod decorators;
mod models;
mod services;
mod settings;

use log::{self, info};
use simple_logger::SimpleLogger;

use controllers::routes;

fn main() {
    SimpleLogger::new()
        .with_level(log::LevelFilter::Info)
        .init()
        .unwrap();

    info!(
        "Starting server on address: {}",
        settings::env::server_address()
    );

    routes::start_server(&settings::env::server_address());
}
