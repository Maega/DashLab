const {config} = require('../../common');
const hue = require('node-hue-api');
const discovery = hue.discovery;
const hueApi = hue.v3.api;

const appName = 'dashlab-hue';
const deviceName = 'nebula-dashlab';

const hueLight = require('./lights.hue.driver');

const driver = new class HueDriver {
    constructor() {
        this._config = config.read('hue');
        this._bridge = {}; // Hue bridge API. Is set at connection time.

        this.connect();
    }

    // * Search for bridges on the network
    // ? Uses nupnp with upnp as fallback to find bridges on the network and returns an array with results
    findBridges = async () => {
        console.log('Searching for Hue Bridges via nupnp... (quick)');
        let discoveryResults = await discovery.nupnpSearch();
    
        // If no bridges were found, perform a longer upnp search
        if (!discoveryResults.length) {
            console.log('No bridges found, trying upnp search... (slow)')
            discoveryResults = await discovery.upnpSearch();
        }
    
        // If no bridges were found, return error
        if (!discoveryResults.length) return false;
    
        console.log(`Found ${discoveryResults.length}x Hue Bridges!`);
        
        return discoveryResults;
    }

    // * Link Hue Bridge with DashLab
    // ? Accepts an IP address param, attempts to link with the bridge and saves a successful link to driver config
    linkBridge = async (bridgeip) => {

        // Set attemptsLeft to 25. One attempt every 2 seconds for a total of 50 seconds of trying to link.
        let attemptsLeft = 25;

        // Connect to bridge without authentication so that we can create a new user
        const unauthenticatedApi = await hueApi.createLocal(bridgeip).connect();

        const attemptLink = async () => {
            try {
                const createdUser = await unauthenticatedApi.users.createUser(appName, deviceName);

                const newConfig = {
                    ipaddress: bridgeip,
                    username: createdUser.username,
                    clientkey: createdUser.clientkey
                };

                // Save configuration to config file and update loaded config
                await config.write('hue', newConfig);
                this._config = newConfig;

                // Attempt to connect to bridge
                await this.connect();

                return true;

            } catch (err) {
                if (!!err.getHueErrorType && err.getHueErrorType() === 101) {
                    console.error(`Link button not pressed. Attempts remaining: ${attemptsLeft}`);
                    attemptsLeft -= 1;
                    attemptsLeft ? setTimeout(() => attemptLink(), 2000) : console.error('Link button not pressed in time. Please try again!')
                } else {
                    console.error(`Unexpected Error: ${err.message}`);
                    return false;
                }
            }
        }

        attemptLink();

    }

    connect = async () => {
        try {

            // Check if Hue driver config is valid
            if (!this._config || !this._config.ipaddress || !this._config.username) {
                console.error('Hue bridge not configured. Run Hue setup to configure. Cannot connect to driver!');
                return false;
            }

            // Create a new API instance that is authenticated with the user defined in config
            this._bridge = await hueApi.createLocal(this._config.ipaddress).connect(this._config.username);
            console.log('Connected to Hue Bridge!');
            return true;

        } catch (err) {

            console.error('Failed to connect to bridge!');
            console.error(err);
            return false;

        }
    }

    // * Currently for debugging
    getLights = async () => {
        const allLights = await this._bridge.lights.getAll();
        allLights.forEach(light => {
            console.log(`(id: ${light.id}) (${light.state.on ? 'on' : 'off'}) ${light.name}`); // (${light.type})
        });
    }

    light = hueLight;

}

module.exports = driver;