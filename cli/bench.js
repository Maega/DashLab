/*
 ! THIS IS NOT RELATED TO DASHLAB.
 ? This is left over from BenchKit and is to be used as reference
 */

const {msg, printLogo, epochToDuration} = require('./common');
const inquirer = require('inquirer');
const cmd = require('node-cmd');
const fs = require('fs-extra')
const {XMLParser} = require('fast-xml-parser');

exports.start = async function(tests) {

    printLogo('AeonLabs TestKit - Benchmarks');

    // If selected tests have not been passed to this function, ask the user
    if (!Array.isArray(tests)) tests = await promptUser();

    const startTime = Date.now();

    const results = {};
    if (tests.includes('cinebench')) results.cinebench = await runCinebench();
    if (tests.includes('aida64')) results.aida64 = await runAida64();
    if (tests.includes('geekbench')) results.geekbench = await runGeekbench();
    if (tests.includes('3dmark')) results['3dmark'] = await run3dmark();

    const totalDuration = epochToDuration(Date.now() - startTime);
    console.log(msg.bold('\nTests Completed in ' + totalDuration));

    console.log('\n');
    console.log(JSON.stringify(results));

    return results;

}

// * Ask the user which tests they want to perform
async function promptUser() {

    /* {
        name: 'orderId',
        message: 'What is this build\'s order number? (Leave blank if not applicable):'
    }, */

    const answers = await inquirer.prompt({
        type: 'checkbox',
        message: 'Which tests should I run?',
        name: 'tests',
        pageSize: 20,
        choices: [
            /* new inquirer.Separator('----- Stress Testing -----'),
            {name: 'AIDA64 Stability Test', value: 'aida64stability', checked: false},
            {name: 'BurnInTest', value: 'burnintest', checked: false},
            {name: 'OCCT', value: 'occt', checked: false}, */
            new inquirer.Separator('----- Synthetic Benchmarks -----'),
            {name: 'Geekbench', value: 'geekbench', checked: false},
            {name: 'Cinebench', value: 'cinebench', checked: true},
            {name: 'AIDA64', value: 'aida64', checked: false},
            {name: '3DMark', value: '3dmark', checked: false},
            new inquirer.Separator('----- Game Benchmarks -----'),
            {name: 'Crysis Remastered', value: 'crysis', checked: false},
            {name: 'Grand Theft Auto V', value: 'gtav', checked: false}
        ],
        validate: function(answer) {
            return answer.length < 1 ? 'So... we\'re doing nothing? Pick something pls.' : true;
        }
    });

    return answers.tests;

}

function runCinebench() {
    console.log(' ');
    console.log(msg.info('Running Cinebench...'));

    const output = cmd.runSync('benchmarks\\CinebenchR20\\Cinebench.exe g_CinebenchCpuXTest=true').data;
    const splitOutput = output.split('\r\n');
    const resultLine = splitOutput[splitOutput.length - 3];
    const result = resultLine.includes('CB ') ? resultLine.split(' ')[1] : 'FAILED';

    console.log(msg.bold('Score: ') + result);
    
    return {
        results: [
            {
                name: 'Multi Core',
                score: result
            }
        ],
        version: '???'
    };
}

async function runAida64() {
    console.log(' ');
    console.log(msg.info('Running AIDA64...'));

    cmd.runSync('benchmarks\\AIDA64\\aida64.exe /ALLBENCH "%temp%\\TestKit_AIDA64Result.xml" /SHOWPCANCEL');

    const xmlParser = new XMLParser();
    const benchXml = fs.readFileSync(process.env.TEMP + '\\TestKit_AIDA64Result.xml');
    const benchData = await xmlParser.parse(benchXml);

    // Delete test result output from filesystem
    fs.remove(process.env.TEMP + '\\TestKit_AIDA64Result.json');

    const results = [];
    benchData.AllBenchResults.Result.forEach(thisResult => results.push({
        name: thisResult.Desc,
        score: thisResult.Result
    }));
    
    return {
        results: results,
        version: benchData.AllBenchResults.SysInfo.AIDA64Version
    }

}

async function runGeekbench() {
    console.log(' ');
    console.log(msg.info('Running Geekbench...'));
    
    cmd.runSync('benchmarks\\Geekbench5\\geekbench5.exe --no-upload --export-json "%temp%\\TestKit_GeekbenchResult.json"');

    // Sleep for 2 seconds to avoid race condition
    //await sleep(2000);

    const benchJson = fs.readFileSync(process.env.TEMP + '\\TestKit_GeekbenchResult.json');
    const benchData = JSON.parse(benchJson);

    // Delete test result output from filesystem
    fs.remove(process.env.TEMP + '\\TestKit_GeekbenchResult.json');

    console.log(msg.bold('Single Core Score: ') + benchData.score);
    console.log(msg.bold('Multi Core Score: ') + benchData.multicore_score);
    console.log(msg.bold('Geekbench Version: ') + benchData.version.split(' ')[1]);
    
    return {
        results: [
            {
                name: 'Single Core',
                score: benchData.score
            },
            {
                name: 'Multi Core',
                score: benchData.multicore_score
            }
        ],
        version: benchData.version.split(' ')[1]
    }

}

async function run3dmark() {
    console.log(' ');
    console.log(msg.info('Running 3DMark...'));
    
    /*
        * 3DMark Definitions
        - aeon_full: Fire Strike (1080p) & Time Spy (1440p)
        - aeon_firestrike: Fire Strike (1080p)
        - aeon_timespy: Time Spy (1440p)
        - aeon_timespy_extreme: Time Spy Extreme (4K)
        - aeon_nightraid: Night Raid (for iGPUs)
        - aeon_portroyal: Port Royal (Ray Tracing)
    */

    cmd.runSync('benchmarks\\3dmark\\3DMarkCmd.exe --definition=aeon_full.3dmdef --export="%temp%\\TestKit_3DMarkResult.xml" --online=off --systeminfo=off'); // --path="%dir3dmark%chops"

    const xmlParser = new XMLParser();
    const benchXml = fs.readFileSync(process.env.TEMP + '\\TestKit_3DMarkResult.xml');
    const benchData = await xmlParser.parse(benchXml);

    // Delete test result output from filesystem
    fs.remove(process.env.TEMP + '\\TestKit_3DMarkResult.xml');

    //console.log(JSON.stringify(benchData.benchmark.results));
    //debugger;

    const result = benchData.benchmark.results.result[0];

    console.log(msg.bold('Fire Strike Overall Score: ') + result.firestrikeoverallscorep);
    console.log(msg.bold('Fire Strike Graphics Score: ') + result.firestrikegraphicsscorep);
    console.log(msg.bold('Fire Strike CPU Score: ') + result.firestrikephysicsscorep);
    console.log(' ');
    console.log(msg.bold('Time Spy Overall Score: ') + result.TimeSpyPerformance3DMarkScore);
    console.log(msg.bold('Time Spy Graphics Score: ') + result.TimeSpyPerformanceGraphicsScore);
    console.log(msg.bold('Time Spy CPU Score: ') + result.TimeSpyPerformanceCPUScore);
    
    return {
        results: [
            {
                name: 'Fire Strike Overall',
                score: result.firestrikeoverallscorep
            },
            {
                name: 'Fire Strike Graphics',
                score: result.firestrikegraphicsscorep
            },
            {
                name: 'Fire Strike CPU',
                score: result.firestrikephysicsscorep
            },
            {
                name: 'Time Spy Overall',
                score: result.TimeSpyPerformance3DMarkScore
            },
            {
                name: 'Time Spy Graphics',
                score: result.TimeSpyPerformanceGraphicsScore
            },
            {
                name: 'Time Spy CPU',
                score: result.TimeSpyPerformanceCPUScore
            }
        ],
        version: '???'
    }

}