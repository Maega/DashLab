const Wifi = require('rpi-wifi-connection');
const wifi = new Wifi();
const {shellExec} = require('../../common');

async function changeHostname(hostname) {
    await shellExec('sudo', ['/boot/dietpi/func/change_hostname', hostname]);
}

module.exports = wifi;