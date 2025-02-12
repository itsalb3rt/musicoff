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
    getDownloaded() {
      return this.downloaded.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },
    someNonDownloaded() {
      return this.downloaded.some(f => !f.downloaded)
    }
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
  }
})
