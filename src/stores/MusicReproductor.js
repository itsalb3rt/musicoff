import { defineStore } from 'pinia'

export const useMusicReproductor = defineStore('musicReproductor', {
  state: () => ({
    videoId: '',
    showPlayer: false,
    random: false,
    repeat: false,
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
