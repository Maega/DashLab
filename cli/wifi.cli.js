const {msg, printLogo} = require('./common.cli');
const inquirer = require('inquirer');
const wifi = require('../drivers/wifi/wifi.driver');

exports.menu = async function() {

    printLogo('Network Settings');

    const action = await inquirer.prompt({
        type: 'list',
        name: 'do',
        message: 'What do you want to do?',
        loop: false,
        pageSize: 10,
        choices: [
            new inquirer.Separator('--- General Options ---'),
            {name: 'Change system hostname', value: 'hostname'},
            new inquirer.Separator('--- WiFi Options ---'),
            {name: 'Connect to a network', value: 'connect'},
            {name: 'Scan & list available networks', value: 'scan'},
            {name: 'View connection status', value: 'status'},
            new inquirer.Separator(),
            {name: 'Exit to Main Menu', value: ''}
        ]
    });

    switch(action.do) {
        case 'scan':
            await scan();
            break;
        case 'connect':
            await connect();
            break;
        case 'status':
            // check current connection status...
            break;
    }
}

// [ { bssid: 'f4:ca:e5:e7:de:58', signalLevel: -72, frequency: 2467, ssid: 'mywifi' } ]
async function scan() {
    const networks = await wifi.scan();
    console.log(networks);
    return networks;
}

async function connect() {

    const networks = await wifi.scan();
    /* const networks = [
        { bssid: 'f4:ca:e5:e7:de:58', signalLevel: -72, frequency: 2467, ssid: 'mywifi' },
        { bssid: 'f4:ca:e5:e7:de:69', signalLevel: -102, frequency: 2467, ssid: 'testwifi2' }
    ] */

    const choices = networks.map(network => {
        return {
            name: `${network.ssid} (Signal: ${network.signalLevel}dB)`,
            value: network.ssid
        }
    });

    const networkConfig = await inquirer.prompt([
        {
            type: 'list',
            name: 'ssid',
            message: 'Which network do you want to connect to?',
            choices: choices
        },
        {
            type: 'password',
            name: 'psk',
            message: 'Enter the network password (PSK):'
        }
    ]);

    wifi.connect(networkConfig).then(() => {
        console.log(`Connected to ${networkConfig.ssid}.`);
    })
    .catch((error) => {
        console.error('Failed to connect to network!');
        console.error(error);
    });
}