import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settingsStore', {
  persist: true,
  state: () => ({
    theme: 'dark',
    locale: 'en',
    server: '',
    googleAPIKey: undefined,
  }),
  getters: {},
  actions: {}
})
