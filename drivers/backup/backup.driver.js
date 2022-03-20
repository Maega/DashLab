const {shellExec} = require('../../common');

const defaultPath = '/mnt/dashlab-backup';

exports.backup = async function(path = defaultPath) {
    await shellExec('sudo', ['/boot/dietpi/dietpi-backup', '1', path]);
}

exports.restore = async function(path = defaultPath) {
    await shellExec('sudo', ['/boot/dietpi/dietpi-backup', '-1', path]);
}