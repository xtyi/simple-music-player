const Store = require('electron-store')
const uuidv4 = require('uuid/v4')
const { basename } = require('path')

class MusicStore extends Store {
  getMusics() {
    return this.get('musics') || []
  }

  addMusics(paths) {
    const currentMusics = this.getMusics()
    const newMusics = paths
      .map(path => {
        return {
          id: uuidv4(),
          path: path,
          fileName: basename(path),
        }
      })
      .filter(music => {
        const currentPaths = currentMusics.map(music => music.path)
        return !currentPaths.includes(music.path)
      })
    this.set('musics', [...currentMusics, ...newMusics])
    return this
  }

  daleteMusic(id) {
    const currentMusics = this.getMusics()
    const newMusics = currentMusics.filter(music => music.id !== id)
    this.set('musics', newMusics)
    return this
  }
}

module.exports = MusicStore
