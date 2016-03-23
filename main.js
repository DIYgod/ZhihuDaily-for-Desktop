'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const Tray = electron.Tray;

let mainWindow = null;
var appIcon = null;

function createWindow() {
    mainWindow = new BrowserWindow({
        title: '知乎日报',
        // icon: 'icon.png',
        width: 970,
        height: 650,
        minWidth: 970,
        minHeight: 650,
        resizable: true,
        center: true,
        show: true,
        frame: true,
        autoHideMenuBar: true,
        titleBarStyle: 'hidden-inset',
        'web-preferences': {
            javascript: true,
            plugins: true,
            // nodeIntegration: false,
            webSecurity: false
            // preload: __dirname + '/inject-preload.js'
        }
    });

    mainWindow.loadURL('file://' + __dirname + '/server/dist/index.html');  // Todo

    // Open Developer Tool
    mainWindow.webContents.openDevTools();

    mainWindow.on('closed', function () {
        mainWindow = null;
    });

    // Tray icon
    // appIcon = new Tray('icon/tray.png');
    // appIcon.setToolTip('This is my application.');

}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});
