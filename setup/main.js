// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron');
const remote = require('@electron/remote/main');
remote.initialize();

let mainWindow;

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1200,
    frame: false,
    fullscreen: true,
    //titleBarStyle: 'hidden', // Hide titleBar since we'll use our own custom controls
    webPreferences: {
        nodeIntegration: true,
        enableRemoteModule: true,
        contextIsolation: false
    },
    resizable: false
  })

  // Load app frontend
  mainWindow.loadFile('index.html');
  //mainWindow.loadURL('chrome://gpu');

  // Enable remote module
  remote.enable(mainWindow.webContents);

  return mainWindow;

};

// When Electron finishes initialising, create the main app window and assign
// the BrowserWindow instance it returns to the app scoped mainWindow variable.
app.whenReady().then(() => mainWindow = createWindow());

// Quit when all windows are closed
app.on('window-all-closed', () => app.quit());
