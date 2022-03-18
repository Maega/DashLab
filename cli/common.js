const chalk = require('chalk');

const msg = {
    bold: chalk.bold,
    info: chalk.bold.blue,
    link: chalk.underline.blue,
    //error: chalk.bgRed.hex('#cccccc'),
    error: chalk.bold.red,
    warn: chalk.bold.yellow,
    brand: chalk.bold.hex('#1c83e2'),
    purple: chalk.bold.hex('#7f00ff')
}
exports.msg = msg;

// * Adds padding to both side of a string to center align it to the ASCII logo in the console
function centerString(text) {
    if (text >= 40) return text; // If text is too long to center, do nothing.
    const padding = Math.floor((40 - text.length) / 2);
    return ' '.repeat(padding) + text + ' '.repeat(padding);
}

exports.printLogo = function(text) {
    console.clear();
    console.log('                                        ');
    console.log(msg.brand('            ________________             '));
    console.log(msg.brand('           |__    ____    __|             '));
    console.log(msg.brand('              |  |    |  |               '));
    console.log(msg.brand('              |  |    |  |               '));
    console.log(msg.brand('              |  |    |  |             '));
    console.log(msg.brand('              /  /    \\  \\           '));
    console.log(msg.brand('             /  /      \\  \\           '));
    console.log(msg.brand('            /  /')+msg.purple('oooooooo')+msg.brand('\\  \\           '));
    console.log(msg.brand('           /  /')+msg.purple('OOOOOOOOOO')+msg.brand('\\  \\           '));
    console.log(msg.brand('          /  /')+msg.purple('OOOOOOOOOOOO')+msg.brand('\\  \\        '));
    console.log(msg.brand('         /  /--------------\\  \\    '));
    console.log(msg.brand('        /______________________\\       '));
    console.log('                                        ');
    console.log('----------------------------------------');
    console.log(msg.bold(centerString(text || 'Nebula DashLab CLI v0.9.0')));
    console.log('----------------------------------------');
    console.log('                                        ');
}

exports.sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

exports.epochToDuration = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return (
        seconds === 60
            ? (minutes + 1) + ':00'
            : minutes + ':' + (seconds < 10 ? '0' : '') + seconds
    );
}