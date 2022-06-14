global.common = require('./common');

global.drivers = {
    wifi: require('./drivers/wifi/wifi.driver'),
    hue: require('./drivers/hue/hue.driver')
}