const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const DataStore = require('./DataStore')

const store = new DataStore({
  name: 'MusicData',
})

class AppWindow extends BrowserWindow {
  constructor(config, filePath) {
    const basicConfig = {
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
      },
    }
    const finalConfig = { ...basicConfig, ...config }
    super(finalConfig)
    this.loadFile(path.join(__dirname, filePath))
  }
}

let mainWindow
let addMusicWindow

function createWindow() {
  mainWindow = new AppWindow({}, './renderer/index.html')

  ipcMain.on('add-music-window', () => {
    addMusicWindow = new AppWindow(
      {
        parent: mainWindow,
      },
      './renderer/add.html',
    )
  })

  ipcMain.on('select-music-file', event => {
    dialog.showOpenDialog(
      {
        properties: ['openFile', 'multiSelections'],
        filters: [{ name: 'Music', extensions: ['mp3'] }],
      },
      pathes => {
        if (Array.isArray(pathes)) {
          event.sender.send('selected-file', pathes)
        }
      },
    )
  })

  ipcMain.on('add-tracks', (event, tracks) => {
    const updatedTracks = store.addTracks(tracks).getTracks()
    console.log(updatedTracks)
  })
}

app.on('ready', createWindow)
