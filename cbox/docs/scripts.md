## Box scripts overview

### run.js script
This script is for run, log and restart tunnel manager script and cbox server.
Required environment variables
* TUNNEL_ENTRYPOINT - path to tunnel.js script
* CBOX_ENTRYPOINT - path to cbox binary file

### tunnel.js script
This script is for creating, recreating and registering tunnel to cbox server on backend API server.
Required environment variables:
* SERVER_PORT - cbox server port
* BACKEND_URL - backend API url
* BACKEND_AUTH_USER - basic auth user (for register tunnel request)
* BACKEND_AUTH_PASSWORD - basic auth password (for register tunnel request)
* BOX_UUID_FILE - file with uuid string for particular box
