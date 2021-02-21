const fs = require('fs');
const { URL } = require('url');

const localTunnel = require('localtunnel');
const fetch = require('node-fetch');

const {
    SERVER_PORT: sPort,
    BACKEND_URL: backendUrl,
    BACKEND_AUTH_USER: authUser,
    BACKEND_AUTH_PASSWORD: authPassword,
    BOX_UUID_FILE: boxUUIDFile,
} = process.env;
const port = +sPort;

(async () => {
    const tunnel = await getTunnel(port);

    setTunnel(tunnel).catch(err => onError(err));

    tunnel.on('close', () => {
        resetTunnel(port).catch(err => onError(err));
    });
})();

function onError(err) {
    console.error(err);
    process.exit(1);
}

/**
 * @param {number} port
 * @return Promise<Tunnel & {url: String} & EventEmitter>
 */
async function getTunnel(port) {
    return await localTunnel({ port });
}

/**
 * @param {number} port
 * @return {Promise<void>}
 */
async function resetTunnel(port) {
    await setTunnel(
        await getTunnel(port)
    );
}

/**
 * @param {{url: String}} tunnel
 * @return {Promise<void>}
 */
async function setTunnel(tunnel) {
    const boxUUID = fs.readFileSync(boxUUIDFile);
    const authString = `${authUser}:${authPassword}`;
    const authBuffer = Buffer.from(authString);

    /**
     * @type {{json: Function}}
     */
    const res = await fetch(
        `${backendUrl}/registration/box`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${authBuffer.toString('base64')}`,
            },
            body: JSON.stringify({
                tunnel_domain: (new URL(tunnel.url)).hostname,
                uuid: boxUUID.toString().trim(),
            }),
        }
    );
    /**
     * @type {{status: String, data: Object}}
     */
    const resBody = await res.json();

    if (resBody.status !== "ok") {
        console.warn(`Api responded with error: ${JSON.stringify(resBody.data)}`);
    }
}
