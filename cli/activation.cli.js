const {msg, printLogo} = require('./common.cli');
const inquirer = require('inquirer');
const info = require('systeminformation');
const activation = require('../drivers/activation/activation.driver');

exports.menu = async function() {

    printLogo('Please Wait...');

    console.log(' ');
    console.log(msg.warn('Checking activation status...'));
    console.log(' ');

    /* var ui = new inquirer.ui.BottomBar();
    ui.updateBottomBar('Checking activation status...'); */

    const uuid = await info.uuid();
    const activationStatus = await activation.status();
    
    printLogo('System Activation');

    console.log(msg.info('System UUID: ') + uuid.hardware);

    const activationMsg = activationStatus.isActivated
        ? msg.success(`Linked to ${activationStatus.activeUser} (${activationStatus.activeEmail})`)
        : msg.error('Unactivated');
    console.log(msg.info('Activation Status: ') + activationMsg);

    if (!activationStatus.isGenuine) console.log(msg.error('\nWARNING: You are not using genuine DashLab hardware!'));

    console.log('');

    const choices = [];

    if (activationStatus.isGenuine && !activationStatus.isActivated) choices.push({name: 'Activate Device', value: 'activate'});
    if (activationStatus.isActivated) choices.push({name: 'Deactivate Device', value: 'deactivate'});

    const action = await inquirer.prompt({
        type: 'list',
        name: 'do',
        message: 'What do you want to do?',
        choices: [
            ...choices,
            new inquirer.Separator(),
            {name: 'Exit to Main Menu', value: ''}
        ]
    });

    switch(action.do) {
        case 'activate':
            
            break;
        case 'deactivate':
            
            break;
        case 'isgenuine':
            // check current connection status...
            break;
    }
}