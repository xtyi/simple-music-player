const { BrowserWindow } = require('electron')
const path = require('path')

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

module.exports = AppWindow
