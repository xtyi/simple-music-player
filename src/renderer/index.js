const { ipcRenderer } = require('electron')
const { $, convertDuration } = require('../helper')

const musicAudio = new Audio()
let g_musics = []
let currentMusic

musicAudio.addEventListener('loadedmetadata', () => {
  // 渲染播放器状态
  renderPlayerStatus(currentMusic.fileName, musicAudio.duration)
})

musicAudio.addEventListener('timeupdate', () => {
  // 更新播放器状态
  updatePlayerStatus(musicAudio.currentTime)
  updatePlayerProgress(musicAudio.currentTime, musicAudio.duration)
})

$('#add-music-window-button').addEventListener('click', () => {
  ipcRenderer.send('add-music-window')
})

$('#music-list').addEventListener('click', event => {
  event.preventDefault()
  const { dataset, classList } = event.target
  if (classList.contains('fa-play')) {
    if (currentMusic && currentMusic.id === dataset.id) {
      musicAudio.play()
    } else {
      currentMusic = g_musics.find(music => music.id === dataset.id)
      musicAudio.src = currentMusic.path
      musicAudio.play()
      const resetIconEl = document.querySelector('.fa-pause')
      if (resetIconEl) {
        resetIconEl.classList.replace('fa-pause', 'fa-play')
      }
    }
    classList.replace('fa-play', 'fa-pause')
  } else if (classList.contains('fa-pause')) {
    classList.replace('fa-pause', 'fa-play')
    musicAudio.pause()
  } else if (classList.contains('fa-trash')) {
    ipcRenderer.send('delete-music', dataset.id)
  }
})

ipcRenderer.on('render-music-list', (event, musics) => {
  renderMusicList(musics)
  g_musics = musics
})

function renderMusicList(musics) {
  const html = musics.reduce((html, music) => {
    html += `
    <li
      class="list-group-item d-flex justify-content-between align-item-center"
      data-uuid="${music.id}"
    >
      <div>
        <i class="fa fa-music"></i>
        <b>${music.fileName}</b>
      </div>
      <div class="music-action">
        <i class="fa fa-play mr-2" data-id="${music.id}"></i>
        <i class="fa fa-trash" data-id="${music.id}"></i>
      </div>
    </li>`
    return html
  }, '')
  $('#music-list').innerHTML = `<ul class="list-group">${html}</ul>`
}

function renderPlayerStatus(name, duration) {
  const player = $('#player-status')
  const html = `
    <div>
      正在播放: ${name}
    </div>
    <div>
      <span id="current-time">00:00</span> / ${convertDuration(duration)}
    </div>
  `
  player.innerHTML = html
}

function updatePlayerStatus(currentTime) {
  const currentTimeEl = $('#current-time')
  currentTimeEl.innerHTML = convertDuration(currentTime)
}

function updatePlayerProgress(currentTime, duration) {
  const progress = Math.floor((currentTime / duration) * 100)
  const bar = $('#player-progress-bar')
  bar.style.width = progress + '%'
}
