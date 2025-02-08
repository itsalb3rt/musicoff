import { defineStore } from 'pinia'

export const useMusicReproductor = defineStore('musicReproductor', {
  state: () => ({
    videoId: '',
    showPlayer: false,
    current: {
      title: '',
      artist: '',
      album: '',
      cover: ''
    }
  }),
  getters: {},
  actions: {
    setVideoId(videoId) {
      this.videoId = videoId
    },
    setShowPlayer(showPlayer) {
      this.showPlayer = showPlayer
    },
  }
})
