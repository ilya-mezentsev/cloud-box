const childProcess = require('child_process');
const spawn = childProcess.spawn;

const {
    TUNNEL_ENTRYPOINT: tunnelEntrypointFile,
    CBOX_ENTRYPOINT: cboxEntryPointFile,
} = process.env;
const spawnTunnelProcess = () => spawn('node', [tunnelEntrypointFile]);
const spawnCboxServerProcess = () => spawn(cboxEntryPointFile);

bindProcessListeners({
    spawnedProcess: spawnTunnelProcess(),
    processName: 'local tunnel',
    respawnFn: spawnTunnelProcess,
});
bindProcessListeners({
    spawnedProcess: spawnCboxServerProcess(),
    processName: 'cbox server',
    respawnFn: spawnCboxServerProcess,
});

function bindProcessListeners({spawnedProcess, processName, respawnFn}) {
    spawnedProcess.stdout.on('data', data => data && console.log(`${processName}: ${data.toString().trim()}`));

    spawnedProcess.stderr.on('data', err => err && console.error(`${processName}: ${err.toString().trim()}`));

    spawnedProcess.on('exit', code => {
        console.log(`${processName} exited with code: ${code}`);

        spawnedProcess.kill('SIGKILL');
        bindProcessListeners({
            spawnedProcess: respawnFn(),
            processName,
            respawnFn,
        })
    });
}
