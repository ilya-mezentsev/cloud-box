use std::error::Error;
use std::fs;

use crate::commands::factory::RespondingCommand;
use crate::models::responses::DisksResponse;
use crate::services::disk_path;

pub struct GetDisks;

impl RespondingCommand<DisksResponse> for GetDisks {
    fn exec(&self) -> Result<DisksResponse, Box<dyn Error>> {
        Ok(DisksResponse {
            disks: fs::read_dir(disk_path::mounting_devices_root_path())?
                .filter(|d| {
                    let d_ref = d.as_ref();

                    d_ref.is_ok()
                        && d_ref.unwrap().metadata().is_ok()
                        && d_ref.unwrap().metadata().unwrap().is_dir()
                })
                .map(|d| d.unwrap().file_name().to_str().unwrap().to_string())
                .collect::<Vec<String>>(),
        })
    }
}
