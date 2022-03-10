const { app, BrowserWindow,Tray,nativeImage,Menu  } = require('electron');
const path = require('path')
const server = require('./app')

let mainWindow;

function createWindow() {

  mainWindow = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
    icon:"icon.ico",
  })

  mainWindow.loadURL('http://localhost:7070')
  mainWindow.removeMenu()
  mainWindow.on('closed', function () {
    mainWindow = null
  });
  //mainWindow.webContents.openDevTools()
  
}

app.on('ready', createWindow)

app.on('resize', function (e, x, y) {
  mainWindow.setSize(x, y);
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
// const env = process.env.NODE_ENV || 'development';
  
// If development environment
// if (env === 'development') {
//   if (env === 'development') {
//     try {
       
//         require('electron-reloader')(__dirname, {
//           electron: path.join(__dirname, 'node_modules', '.bin', 'electron' ,'session_functions', 'routes','main_functions'),
//           hardResetMethod: 'exit',
//           debug: true,
//             watchRenderer: true
//       });
//     } catch (_) { console.log('Error'); }    
// }
    
// }