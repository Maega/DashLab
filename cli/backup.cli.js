const inquirer = require('inquirer');
const {shellExec} = require('../common');
const backup = require('../drivers/backup/backup.driver');

exports.menu = async function() {

    const action = await inquirer.prompt({
        type: 'list',
        name: 'do',
        message: 'DashLab Backup & Restore',
        choices: [
            {name: 'Create a new backup', value: 'backup'},
            {name: 'Restore an existing backup', value: 'restore'},
            {name: 'List existing backups', value: 'list'},
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
        case 'tool':
            await shellExec('sudo', ['/boot/dietpi/dietpi-backup']);
            break;
    }
}