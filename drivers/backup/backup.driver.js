const {shellExec} = require('../../common');

const defaultPath = '/mnt/dashlab-backup';

exports.backup = async function(path = defaultPath) {
    await shellExec('sudo', ['G_INTERACTIVE=0', '/boot/dietpi/dietpi-backup', '1', path], 'DashLab is backing up...');
}

exports.restore = async function(path = defaultPath) {
    await shellExec('sudo', ['G_INTERACTIVE=0', '/boot/dietpi/dietpi-backup', '-1', path], 'DashLab is restoring a backup...');
}