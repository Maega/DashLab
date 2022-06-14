const {msg, printLogo} = require('./common.cli');
const inquirer = require('inquirer');
const installer = require('../drivers/installer/installer.driver');


exports.menu = async function() {

    printLogo('Manage Apps');

    const action = await inquirer.prompt({
        type: 'list',
        name: 'do',
        message: 'What do you want to do?',
        choices: [
            {name: 'Install Apps', value: 'install'},
            {name: 'Uninstall Apps', value: 'uninstall'},
            {name: 'List Installed Apps', value: 'listinstalled'},
            new inquirer.Separator(),
            {name: 'Exit to Main Menu', value: ''}
        ]
    });

    switch(action.do) {
        case 'install':
            await installApp();
            break;
        case 'uninstall':
            await uninstallApp();
            break;
        case 'listinstalled':
            console.log(await installer.listInstalled());
            break;
    }
}

const installApp = async function() {
    
    const notInstalledApps = await installer.listNotInstalled();

    const choices = notInstalledApps.map(app => {
        return {
            name: `${app.name}: ${app.description}`,
            value: app.id
        }
    });

    const action = await inquirer.prompt({
        type: 'list',
        name: 'appId',
        message: 'Which app would you like to install?',
        loop: false,
        pageSize: 15,
        choices: [
            ...choices,
            new inquirer.Separator(),
            {name: 'Exit to Main Menu', value: ''}
        ]
    });

    if (action.appId === '') return;

    console.log('Installing app with ID ' + action.appId);
    await installer.install(action.appId);
}
exports.installApp = installApp;

const uninstallApp = async function() {
    
    const installedApps = await installer.listInstalled();

    const choices = installedApps.map(app => {
        return {
            name: app.name,
            value: app.id
        }
    });

    const action = await inquirer.prompt({
        type: 'list',
        name: 'appId',
        message: 'Which app would you like to uninstall?',
        loop: false,
        pageSize: 15,
        choices: [
            ...choices,
            new inquirer.Separator(),
            {name: 'Exit to Main Menu', value: ''}
        ]
    });

    if (action.appId === '') return;

    console.log('Uninstalling app with ID ' + action.appId);
    await installer.uninstall(action.appId);
}
exports.uninstallApp = uninstallApp;