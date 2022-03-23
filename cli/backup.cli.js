const {msg, printLogo} = require('./common.cli');
const inquirer = require('inquirer');
const {shellExec} = require('../common');
const backup = require('../drivers/backup/backup.driver');

let backupPath = '/mnt/dashlab-backup';

const menu = async function() {

    printLogo('Backup & Restore');

    console.log(msg.info('Backup Location: ') + backupPath);

    const action = await inquirer.prompt({
        type: 'list',
        name: 'do',
        message: 'DashLab Backup & Restore',
        choices: [
            {name: 'Create a new backup', value: 'backup'},
            {name: 'Restore an existing backup', value: 'restore'},
            {name: 'List existing backups', value: 'list'},
            {name: 'Change backup location', value: 'changepath'},
            {name: 'Launch DietPi-Backup', value: 'tool'},
            new inquirer.Separator(),
            {name: 'Exit to Main Menu', value: ''}
        ]
    });

    switch(action.do) {
        case 'backup':
            await backup.backup();
            break;
        case 'restore':
            await backup.restore();
            break;
        case 'list':
            break;
        case 'changepath':
            await changePath();
            break;
        case 'tool':
            await shellExec('sudo', ['/boot/dietpi/dietpi-backup']);
            break;
    }
}
exports.menu = menu;

const changePath = async function() {

    const backupLocation = await inquirer.prompt({
        type: 'input',
        name: 'path',
        message: 'Enter a path to set the backup location to'
    });

    backupPath = backupLocation.path;

    await menu();

}