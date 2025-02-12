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
        createdAt
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
      let ordered = this.downloaded

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

      // return this.downloaded.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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
