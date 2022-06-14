const {exec, spawn} = require("child_process");
const path = require('path');
const fs = require('fs-extra');


const ipc = require('node-ipc').default;

ipc.config.retry = 1500;
ipc.config.silent = true;
ipc.connectTo('socket-api', () => {
    ipc.of['socket-api'].on('connect', () => {
        console.log('Connected to Socket API!')
        //ipc.of['socket-api'].emit('terminal', "The message we send");
    });
});

//const {emit} = require('./api/console');
function emit(data) {
    ipc.of['socket-api'].emit('terminal', data);
}

exports.config = {
    read: (configName) => {
        const pathToConfig = `${path.resolve(__dirname)}/config/${configName}.config.json`;
        if (!fs.pathExistsSync(pathToConfig)) return {};
        return fs.readJsonSync(pathToConfig);
    },
    write: (configName, configData) => {
        fs.outputJsonSync(`${path.resolve(__dirname)}/config/${configName}.config.json`, configData);
    }
}

// Runs a script from the scripts directory and parses its JSON stdout
exports.runScript = async function(scriptName, interactive = false) {

    const result = await new Promise(async function(resolve, reject) {
        //const escapedScriptName = scriptName.replace(/[^a-z\d]/g, '\\$&');
        const script = interactive
            ? spawn("bash", [`./scripts/${scriptName}.sh`], { stdio: 'inherit' })
            : spawn("bash", [`./scripts/${scriptName}.sh`]);
        script.stdout.on("data", data => resolve(data));
        script.stderr.on("data", data => console.error(`Script "${scriptName}" wrote to stderr: ${data}`));
        script.on('error', (error) => reject(error));
        /* script.on("close", code => console.log(`child process exited with code ${code}`)); */
    });

    const jsonResult = JSON.parse(result);
    return jsonResult;

}

// Executes a shell command interactively, does not parse output
exports.shellExec = async function(shellCmd, shellArgs = [], busyMsg = "Terminal is busy...") {

    const result = await new Promise(async function(resolve, reject) {

        const script = spawn(shellCmd, shellArgs); //, { stdio: 'inherit' }

        script.stdout.on("data", data => {
            emit({
                state: "busy",
                busyMsg: busyMsg,
                out: {
                    raw: data.toString('utf8')
                }
            });
        });

        script.on('close', (code) => {
            console.log('Shell process ended with exit code ', code);
            emit({
                state: "idle",
                out: {
                    raw: code === 0
                        ? "\n\x1b[1;32mTask completed successfully\x1b[0m"
                        : "\n\x1b[1;31mTask ended with exit code " + code + "\x1b[0m"
                }
            });
            resolve(code);
        });

    });

    if (result !== 0) console.error('Shell process exited with an error code!!');

    return result;

}

exports.sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));