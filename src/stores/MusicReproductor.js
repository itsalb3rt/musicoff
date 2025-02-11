import { defineStore } from 'pinia'

const DEFAULT_MUSIC_SRTUCTURE = {
  id: {
    videoId: '',
  },
  snippet: {
    title: '',
    thumbnails: {
      default: {
        url: '',
      },
    },
  },
  contentDetails: {
    duration: '',
  },
}
export const useMusicReproductor = defineStore('musicReproductor', {
  persist: true,
  state: () => ({
    videoId: '',
    showPlayer: false,
    random: false,
    repeat: false,
    lastMusic: DEFAULT_MUSIC_SRTUCTURE,
    current: DEFAULT_MUSIC_SRTUCTURE,
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
