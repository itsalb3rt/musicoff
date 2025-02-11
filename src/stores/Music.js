import { defineStore } from 'pinia'

export const useMusicStore = defineStore('music', {
  persist: true,
  state: () => ({
    downloaded: [],
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
    remove(uuid) {
      this.downloaded = this.downloaded.filter(f => f.uuidName !== uuid)
    },
  }
})
