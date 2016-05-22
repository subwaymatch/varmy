'use strict';

// shared globally
GLOBAL.__app = {
	basePath: __dirname,
	dataPath: __dirname + "/.data/"
};

const electron = require('electron');
const app = electron.app; 						// module to control application life
const BrowserWindow = electron.BrowserWindow; 	// module to create native browser window

var wordWindow = null;

app.on('window-all-closed', function() {
		app.quit();
});

app.on('ready', function() {
	wordWindow = new BrowserWindow({
		width: 440,
		height: 120,
		frame: false,
		fullscreenable: false,
		resizable: false,
		alwaysOnTop: true,
		title: 'WordStock'
	});

	// load index.html of the app
	wordWindow.loadURL('file://' + __dirname + '/html-pages/index.html');

	// open DevTools
	wordWindow.webContents.openDevTools();

	// emitted when window is closed
	wordWindow.on('closed', function() {
		wordWindow = null;
	});
});