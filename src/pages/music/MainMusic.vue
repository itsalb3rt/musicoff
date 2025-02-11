<template>
  <q-page padding>
    <p class="text-h5">{{ musicStore.downloadedCount }}</p>
    <div v-for="music in musicStore.downloaded" :key="music.downloaded">
      <music-card :music="music" />
    </div>
  </q-page>
</template>

<script setup>
import { useMusicStore } from 'src/stores/Music'
import MusicCard from 'components/music/MusicCard.vue'

const musicStore = useMusicStore()
</script>
