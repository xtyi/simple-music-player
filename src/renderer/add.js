const { ipcRenderer } = require('electron')
const { $ } = require('./helper')
const path = require('path')

let musicFilesPath = []

$('#select-music-button').addEventListener('click', () => {
  ipcRenderer.send('select-music-file')
})

$('#add-music-button').addEventListener('click', () => {
  if (musicFilesPath.length === 0) {
    ipcRenderer.send('add-tracks', musicFilesPath)
  }
})

ipcRenderer.on('selected-file', (event, pathes) => {
  renderMusicList(pathes)
  musicFilesPath = pathes
})

function renderMusicList(pathes) {
  const inner = pathes.reduce((html, music) => {
    html += `<li class="list-group-item">${path.basename(music)}</li>`
    return html
  }, '')
  $('#music-list').innerHTML = `<ul class="list-group">${inner}</ul>`
}
