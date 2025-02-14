import { defineStore } from 'pinia'


export const useMusicStore = defineStore('music', {
  persist: true,
  state: () => ({
    downloaded: [
      /**
      {
        uuid
        originId
        title
        artist
        album
        duration
        thumbnail
        downloaded // to check if the file is downloaded
        playTimes
        createdAt
      }
       */
    ],
    currentPlayList: [], // This is the current playlist in the player to use all the logic over it
    playlists: [
      /***
       {
        uuid: 'uuid',
        name: 'Gym workout',
        musics: [],
        orderNumber: 1
       }
       */
    ],
    sortBy: 'newToOld' // newToOld, oldToNew, titleAZ, titleZA
  }),
  getters: {
    downloadedCount() {
      return this.downloaded.length
    },
    getDownloaded() {
      let ordered = [...this.downloaded]

      if (this.sortBy === 'newToOld') {
        ordered = this.downloaded.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (this.sortBy === 'oldToNew') {
        ordered = this.downloaded.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      } else if (this.sortBy === 'titleAZ') {
        ordered = this.downloaded.sort((a, b) => a.title.localeCompare(b.title));
      } else if (this.sortBy === 'titleZA') {
        ordered = this.downloaded.sort((a, b) => b.title.localeCompare(a.title));
      }

      return ordered
    },
    someNonDownloaded() {
      return this.downloaded.some(f => !f.downloaded)
    },
    getTop10() {
      const ordered = [...this.downloaded]
      return ordered.sort((a, b) => (b.playTimes || 0) - (a.playTimes || 0)).slice(0, 10)
    },

  },
  actions: {
    add(file) {
      this.downloaded.push(file)
    },
    // This method is used to set ALL downloaded files, is dangerous to use it
    setDownloaded(files) {
      this.downloaded = files
    },
    isDownloaded(originId) {
      return this.downloaded.some(f => f.originId === originId)
    },
    remove(uuid) {
      this.downloaded = this.downloaded.filter(f => f.uuid !== uuid)
    },
    addPlayList({ name, musics, uuid }) {
      this.playlists.push({
        uuid,
        name,
        musics: musics || [],
        orderNumber: this.playlists.length + 1,
      })
    },
    deletePlayList(uuid) {
      this.playlists = this.playlists.filter(p => p.uui !== uuid)
    },
    addMusicToPlaylist({ musicUuid, playlistUuid }) {
      const playlist = this.playlists.find(p => p.uuid === playlistUuid)
      const music = this.downloaded.find(m => m.uuid === musicUuid)
      playlist.musics.push(music)
    },
    removeMusicFromPlaylist({ musicUuid, playlistUuid }) {
      const playlist = this.playlists.find(p => p.uuid === playlistUuid)
      playlist.musics = playlist.musics.filter(m => m.uuid !== musicUuid)
    },
    clearAllPlaylists() {
      this.playlists = []
    }
  }
})
