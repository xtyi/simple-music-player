const { app, ipcMain, dialog } = require('electron')
const AppWindow = require('./AppWindow')
const MusicStore = require('./MusicStore')

const store = new MusicStore()

let mainWindow
let addMusicWindow

app.on('ready', createWindow)

function createWindow() {
  mainWindow = new AppWindow({}, './renderer/index.html')
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.send('render-music-list', store.getMusics())
  })

  // from: index.js
  ipcMain.on('add-music-window', () => {
    addMusicWindow = new AppWindow(
      {
        parent: mainWindow,
      },
      './renderer/add.html',
    )
  })

  // from: add.js
  ipcMain.on('select-musics', event => {
    dialog.showOpenDialog(
      {
        properties: ['openFile', 'multiSelections'],
        filters: [{ name: 'Music', extensions: ['mp3', 'flac'] }],
      },
      paths => {
        if (Array.isArray(paths)) {
          addMusicWindow.send('selected-file', paths)
        }
      },
    )
  })

  // from: add.js
  ipcMain.on('add-musics', (event, musics) => {
    const updatedMusics = store.addMusics(musics).getMusics()
    mainWindow.send('render-music-list', updatedMusics)
    addMusicWindow.close()
  })

  ipcMain.on('delete-music', (event, id) => {
    const updatedMusics = store.daleteMusic(id).getMusics()
    mainWindow.send('render-music-list', updatedMusics)
  })
}
