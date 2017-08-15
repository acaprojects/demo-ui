/*
* @Author: Alex Sorafumo
* @Date:   2017-05-15 11:37:16
 * @Last Modified by: Alex Sorafumo
 * @Last Modified time: 2017-07-07 16:50:03
*/

'use strict';

// ./main.js
const { app, BrowserWindow } = require('electron');
const url = require('url');
const path = require('path');
const env = require('./env');

module.paths.push(path.resolve('node_modules'));
module.paths.push(path.resolve('../node_modules'));
module.paths.push(path.resolve(__dirname, '..', '..', '..', '..', 'resources', 'app', 'node_modules'));
module.paths.push(path.resolve(__dirname, '..', '..', '..', '..', 'resources', 'app.asar', 'node_modules'));

let win = null;

app.on('ready', function () {

    // Initialize the window to our specified dimensions
    win = new BrowserWindow({ width: 1000, height: 600 });

    // Specify entry point
    if (env.package === true) {
        win.loadURL(url.format({
            pathname: path.join(__dirname, 'dist/index.html'),
            protocol: 'file:',
            slashes: true
        }));
        win.webContents.openDevTools();
    } else {
        win.loadURL(env.host);
        win.webContents.openDevTools();
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
})

app.on('window-all-closed', function () {
    if (process.platform != 'darwin') {
        app.quit();
    }
});
