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
        duration
        thumbnail
        downloaded // to check if the file is downloaded
        createdAt
      }
       */
    ],
  }),
  getters: {
    downloadedCount() {
      return this.downloaded.length
    },
  },
  actions: {
    add(file) {
      this.downloaded.push(file)
    },
    isDownloaded(originId) {
      return this.downloaded.some(f => f.originId === originId)
    },
    remove(uuid) {
      this.downloaded = this.downloaded.filter(f => f.uuid !== uuid)
    },
  }
})
