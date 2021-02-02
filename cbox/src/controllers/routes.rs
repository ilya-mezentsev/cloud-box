use crate::controllers::handlers::{
    create_file, create_folder, delete_file, delete_folder, get_disks, get_file, get_folder, rename,
};

pub fn start_server(addr: &str) {
    rouille::start_server(addr, move |request| {
        router!(
            request,

            (GET) (/disks) => {
                get_disks()
            },

            (GET) (/file) => {
                get_file(request)
            },

            (POST) (/file) => {
                create_file(request)
            },

            (PATCH) (/file) => {
                rename(request)
            },

            (DELETE) (/file) => {
                delete_file(request)
            },

            (GET) (/folder) => {
                get_folder(request)
            },

            (POST) (/folder) => {
                create_folder(request)
            },

            (PATCH) (/folder) => {
                rename(request)
            },

            (DELETE) (/folder) => {
                delete_folder(request)
            },

            _ => rouille::Response::empty_404(),
        )
    });
}
