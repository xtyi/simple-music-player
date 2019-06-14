const Store = require('electron-store')
const uuidv4 = require('uuid/v4')
const path = require('path')

class DataStore extends Store {
  getTracks() {
    return this.get('tracks') || []
  }

  addTracks(tracks) {
    const currentTracks = this.getTracks()
    const tracksWithProps = tracks
      .map(track => {
        return {
          id: uuidv4(),
          path: track,
          fileName: path.basename(track),
        }
      })
      .filter(track => {
        const currentTracksPath = currentTracks.map(track => track.path)
        return !currentTracksPath.includes(track.path)
      })
    const newTracks = [...currentTracks, ...tracksWithProps]
    this.set('tracks', newTracks)
    return this
  }
}

module.exports = DataStore
