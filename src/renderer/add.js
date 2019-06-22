const { ipcRenderer } = require('electron')
const { $ } = require('../helper')
const { basename } = require('path')

let g_paths = []

$('#select-music-button').addEventListener('click', () => {
  ipcRenderer.send('select-musics')
})

$('#add-music-button').addEventListener('click', () => {
  if (g_paths.length !== 0) {
    ipcRenderer.send('add-musics', g_paths)
  }
})

ipcRenderer.on('selected-file', (event, paths) => {
  renderMusicList(paths)
  g_paths = paths
})

function renderMusicList(paths) {
  const html = paths.reduce((html, path) => {
    html += `<li class="list-group-item">${basename(path)}</li>`
    return html
  }, '')
  $('#music-list').innerHTML = `<ul class="list-group">${html}</ul>`
}
