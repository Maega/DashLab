const {exec, spawn} = require("child_process");
const path = require('path');
const fs = require('fs-extra');

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
exports.runScript = async function(scriptName) {

    const result = await new Promise(async function(resolve, reject) {
        //const escapedScriptName = scriptName.replace(/[^a-z\d]/g, '\\$&');
        const script = spawn("bash", [`./scripts/${scriptName}.sh`]);
        script.stdout.on("data", data => resolve(data));
        script.stderr.on("data", data => console.error(`Script "${scriptName}" wrote to stderr: ${data}`));
        script.on('error', (error) => reject(error));
        /* script.on("close", code => console.log(`child process exited with code ${code}`)); */
    });

    const jsonResult = JSON.parse(result);
    return jsonResult;

}

exports.sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));