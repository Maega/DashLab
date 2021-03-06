const {spawn} = require("child_process");
const {shellExec} = require('../../common');
const fs = require('fs-extra');

const repo = require('./repo/repo.json');

let allApps = [];
async function initApps() {
    allApps = await listApps();
}

const listRepo = async function() {

    repo.forEach((app, index) => {
        if (app.type !== 'dietpi') return;
        repo[index].isInstalled = isInstalled(app.id);
    });

    return repo;
}
exports.listRepo = listRepo;

// Returns bool specifying whether supplied software ID is installed
const isInstalled = function(id) {

    const {isInstalled} = allApps.find(item => item.id === id);
    return isInstalled;

}
exports.isInstalled = isInstalled;

// Lists all DietPi optimised software
// Returns array of JSON objects with metadata for each app
const listApps = async function() {

    function ansiRegex({onlyFirst = false} = {}) {
        const pattern = [
            '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
            '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))'
        ].join('|');
    
        return new RegExp(pattern, onlyFirst ? undefined : 'g');
    }

    const result = await new Promise(async function(resolve, reject) {
        const script = spawn('sudo', ['/opt/dashlab/scripts/installApp.sh', 'list']);
        script.stdout.setEncoding('utf8');

        var result = '';
        script.stdout.on('data', data => result += data.toString());
        script.on('close', exitCode => resolve(result.replace(ansiRegex(), '')));
    });

    const splitResult = result.split('\n');

    const appList = [];
    splitResult.forEach(line => {

        if (!line.includes('ID ')) return;

        const lineArr = line.replace(' | | ', ' |  | ').split(' | ');

        if (lineArr.length < 2) return;

        const appMeta = {
            id: lineArr[0].replace('ID ', ''),
            name: lineArr[2].split(/: (.*)/s)[0],
            description: lineArr[2].split(/: (.*)/s)[1],
            status: lineArr[1].replace('=', ''),
            isInstalled: lineArr[1] === '=2'
            //dependencies: lineArr[3].split('+')
        }

        appList.push(appMeta);
    });

    return appList;

}
exports.listApps = listApps;

// Lists only currently installed DietPi optimised software
exports.listInstalled = async function() {

    const allApps = await listApps();

    const installedApps = allApps.filter(app => app.isInstalled);

    return installedApps;

}

// Lists only currently uninstalled DietPi optimised software
exports.listNotInstalled = async function() {

    const allApps = await listApps();

    const notInstalledApps = allApps.filter(app => !app.isInstalled);

    return notInstalledApps;

}

exports.install = async function(appId) {

    // Run preinstall script if present
    const preinstall = `/opt/dashlab/drivers/installer/repo/installscripts/${appId}/preinstall`;
    if (await fs.pathExists(preinstall)) await shellExec('sudo', [preinstall], 'Preparing to install app...');

    // Run installation
    await shellExec('sudo', ['/opt/dashlab/scripts/installApp.sh', 'install', appId], 'Installing app, please wait...');

    // Run postinstall script if present
    const postinstall = `/opt/dashlab/drivers/installer/repo/installscripts/${appId}/postinstall`;
    if (await fs.pathExists(postinstall)) await shellExec('sudo', [postinstall], 'Setting up app...');

    // Refresh app list
    await initApps();
    
}

exports.uninstall = async function(appId) {
    await shellExec('sudo', ['/opt/dashlab/scripts/installApp.sh', 'uninstall', appId], 'Uninstalling App...');
    await initApps();
}

initApps();

// Lists only currently installed DietPi optimised software - OLD
/* exports.listInstalled = async function() {

    const result = fs.readFileSync('/boot/dietpi/.installed', 'utf8');
    const splitResult = result.split('\n');

    const installedNums = [];
    splitResult.forEach(line => {
        if (!line.includes('aSOFTWARE_INSTALL_STATE') || !line.includes(']=2')) return;
        installedNums.push(line.replace('aSOFTWARE_INSTALL_STATE[','').replace(']=2',''));
    })

    console.log(installedNums);

    // 'aSOFTWARE_INSTALL_STATE[x]=2'

    return installedNums;

} */