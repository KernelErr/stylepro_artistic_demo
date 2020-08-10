// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')
const fs = require('fs');
const request = require('request');
const { Image } = require('image-js');

const stylepro_artistic = async (content_path, style_path) => {
  const remote = 'http://127.0.0.1:8866/predict/stylepro_artistic';
  const content_image = await Image.load(content_path);
  const style_image = await Image.load(style_path);
  var data = {
      'images': [
          {
              'content': content_image.toBase64(),
              'styles': [style_image.toBase64()]
          }
      ]
  };
  var headers = { 'content-type': 'application/json' };
  return new Promise(function(resolve, reject){
      request({
          url: remote,
          method: 'POST',
          json: true,
          headers: headers,
          body: data,
      }, function (error, result) {
          if(error){reject(error)}else{resolve(result)}
      });
  })
}

var content_image = "";
var style_image = "";

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    },
  })

  // and load the index.html of the app.
  mainWindow.loadFile('./resource/html/index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on('content_drag', (event, arg) => {
  console.log("*");
  console.log(arg);
  content_image = arg;
})

ipcMain.on('style_drag', (event, arg) => {
  console.log("**");
  console.log(arg);
  style_image = arg;
})

ipcMain.on('getInference', (event, arg) => {
  stylepro_artistic(content_image, style_image).then(
    function(result){
      event.returnValue = result.body.results[0].data;
    }
  );
})