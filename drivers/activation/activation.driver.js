const info = require('systeminformation');
const axios = require('axios');

//const baseUrl = 'https://dashapi.nebu.dev';
const baseUrl = 'https://4da97fd0-223c-4cbb-8a80-bc8a13dd1dfa.mock.pstmn.io';

// Check current activation status
exports.status = async function() {

    const uuid = await info.uuid();

    const response = await axios.get(baseUrl + '/activation/status', {
        params: {
            uuid: uuid.hardware
        }
    });

    return response.data;

}