const {msg, printLogo} = require('./common');
const inquirer = require('inquirer');
const info = require('systeminformation');
const {runScript} = require('../common'); // Global Common Import

//const bench = require('./bench');

async function main(getSysInfo = true) {

    printLogo();

    if (getSysInfo) await getSystemInfo();

    const action = await inquirer.prompt({
        type: 'list',
        name: 'do',
        message: 'What would you like to do?',
        choices: [
            {name: 'Edit WiFi Settings', value: 'wifi'},
            {name: 'Change Unix Password', value: 'passwd'},
            {name: 'Update System & Apps', value: 'update'},
            {name: 'Reset All Settings', value: 'reset'}
        ]
    });

    switch(action.do) {
        case 'wifi':
            //await bench.start();
            break;
        case 'passwd':
            // change unix password
            break;
        case 'update':
            // perform all updates (apt, dietpi, etc..)
            break;
        case 'reset':
            // reset all settings
            break;
    }

    const restart = await inquirer.prompt({
        type: 'confirm',
        name: 'do',
        message: 'Would you like to do something else?',
        default: true,
    });

    restart.do
        ? main(false)
        : printLogo('Thank you, come again!') && process.exit();

}

async function getSystemInfo() {

    console.log('Getting DashLab System Info...');
    const piStats = await runScript('systemStats');
    
    const sysInfo = {};

    console.log('Getting System UUID...')
    sysInfo.uuid = await info.uuid();

    console.log('Getting Motherboard Information...');
    sysInfo.mobo = await info.baseboard();
    
    console.log('Getting CPU Information...');
    sysInfo.cpu = await info.cpu();

    console.log('Getting RAM Information...');
    const memInfo = await info.mem();
    sysInfo.ram = {
        ...memInfo,
        totalGB: Math.ceil(memInfo.total / 1073741824), // RAM total in bytes / (1024 * 1024 * 1024), rounded up to nearest integer. Should give us total RAM in GB.)
    }

    console.log('Getting OS Information...');
    sysInfo.os = await info.osInfo();

    printLogo();

    console.log(msg.info('Operating System: ') + `${sysInfo.os.logofile.charAt(0).toUpperCase() + sysInfo.os.logofile.slice(1)} ${sysInfo.os.release} "${sysInfo.os.codename}" (Linux ${sysInfo.os.kernel})`);
    console.log(msg.info('Hardware MLB: ') + `${sysInfo.mobo.model} (${sysInfo.ram.totalGB}GB RAM)`);
    console.log(msg.info('Processor: ') + `${sysInfo.cpu.vendor} ${sysInfo.cpu.brand} (${sysInfo.cpu.physicalCores} Cores)`);
    console.log(msg.info('CPU Status: ') + `${piStats.cpu.freqGhz}GHz @ ${piStats.cpu.temp}C`);
    console.log(msg.info('Memory: ') + `${piStats.ram.available}MB/${piStats.ram.total}MB Available (${piStats.ram.used}MB Used)`);
    console.log(msg.info('Active Governor: ') + `${piStats.cpu.governor}`);
    console.log(msg.info('System UUID: ') + sysInfo.uuid.hardware);

    // Check if frequency capped
    if (piStats.power.frequencyCapped) console.log(msg.warn('\nWARNING: DashLab\'s clock speed is currently capped!!'));
    if (piStats.power.frequencyCappedOccurred) console.log(msg.warn('\nWARNING: DashLab\'s clock speed has been capped since bootup!!'));

    // Check if thermal throttling
    if (piStats.power.throttled) console.log(msg.warn('\nWARNING: DashLab is currently thermal throttling!!'));
    if (piStats.power.throttledOccurred) console.log(msg.warn('\nWARNING: DashLab has thermal throttled this session!!'));

    // Check if under voltage
    if (piStats.power.underVoltage) console.log(msg.error('\nWARNING: DashLab is currently running under voltage!! Check the power supply!'));
    if (piStats.power.underVoltageOccurred) console.log(msg.warn('\nWARNING: DashLab ran under voltage this session! Check the power supply!'));

    // Check if thermals are high
    const fCPUTemp = parseFloat(piStats.cpu.temp);
    if (fCPUTemp >= 65 && fCPUTemp < 80) console.log(msg.warn(`\nWARNING: DashLab's CPU is currently running hot (${piStats.cpu.temp}C)`));
    if (fCPUTemp >= 80) console.log(msg.error(`\nWARNING: DashLab is currently overheating!! (${piStats.cpu.temp}C)`));

    console.log(' ');

    /* global.infoModule = info;
    global.sysInfo = sysInfo; */

    return sysInfo;

}

main();