const remote = require('@electron/remote');
const win = remote.getCurrentWindow();
const $ = require('jquery');
const Swal = require('sweetalert2');
const {sleep} = require('../common');

const windowMan = {

    next: () => {
        const firstWindow = $('.window:first-of-type');
        const currentWindow = $('.window:not(.is-hidden)');
        const nextWindow = $('.window:not(.is-hidden) + .window.is-hidden');
    
        currentWindow.addClass('is-hidden');
    
        // If there's no more windows, reset to the first window
        nextWindow.length
            ? nextWindow.removeClass('is-hidden')
            : firstWindow.removeClass('is-hidden');
    },

    back: () => {
        const lastWindow = $('.window:last-of-type');
        const currentWindow = $('.window:not(.is-hidden)');
        const previousWindow = $('.window.is-hidden:has(+ .window:not(.is-hidden))');
    
        currentWindow.addClass('is-hidden');
    
        // If there's no more windows, reset to the first window
        previousWindow.length
            ? previousWindow.removeClass('is-hidden')
            : lastWindow.removeClass('is-hidden');
    }

}

const wifi = require('../drivers/wifi/wifi.driver');
let wifiScanBreak = false;
async function wifiScan() {

    // Scan for ~30 seconds or until break
    for (let i = 0; i < 6; i++) {

        if (wifiScanBreak) {
            wifiScanBreak = false;
            break;
        }

        console.log('Running WiFi AP Scan #' + (i + 1));

        const results = await wifi.scan();

        $('#wifi-list').empty();
        results.forEach(result => {
            $('#wifi-list').append(`<li><i class="fad fa-wifi"></i> ${result.ssid}</li>`)
        });

        await sleep(5000);

    }

    $('#wifi-scan-status').addClass('is-hidden');

}

// Detect 5 taps on logo for debug menu
let debugTaps = 0;
$(document).on('click', 'div.logo', (event) => {

    debugTaps += 1;

    if (debugTaps === 1) {
        setTimeout(() => debugTaps = 0, 1000);
    }

    if (debugTaps === 5) {
        Swal.fire({
            title: 'Debug Menu',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Do Nothing',
            denyButtonText: `Exit Setup`,
            allowOutsideClick: false
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire('Did nothing...', '', 'success')
            } else if (result.isDenied) {
                win.close();
            }
        })
    }

})