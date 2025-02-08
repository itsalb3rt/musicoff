<template>
  <q-page padding>
    <q-input
      outlined
      v-model="query"
      placeholder="Search YouTube videos"
      @keyup.enter="searchVideos"
    />
    <q-list v-if="videos.length">
      <q-item v-for="video in videos" :key="video.id.videoId">
        <q-item-section avatar>
          <img :src="video.snippet.thumbnails.default.url" alt="thumbnail" />
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ video.snippet.title }}</q-item-label>
          <q-item-label caption>{{ video.snippet.channelTitle }}</q-item-label>
          <q-item-label caption>{{ video?.contentDetails?.duration }}</q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-btn @click="playAudio(video)" label="Play as Audio" />
          <q-btn @click="downloadAudio(video.id.videoId)" label="Download as Audio" />
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useMusicReproductor } from 'src/stores/MusicReproductor'

const musicReproductorStore = useMusicReproductor()

const query = ref('')
const videos = ref([])

const searchVideos = async () => {
  const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
    params: {
      part: 'snippet',
      q: query.value,
      type: 'video',
      key: 'AIzaSyANuwx4onWoG4y7hz_RJtkkItq0BVJ8NWU',
    },
  })

  const videoIds = response.data.items.map((item) => item.id.videoId).join(',')
  const detailsResponse = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
    params: {
      part: 'contentDetails',
      id: videoIds,
      key: 'AIzaSyANuwx4onWoG4y7hz_RJtkkItq0BVJ8NWU',
    },
  })

  videos.value = response.data.items.map((item, index) => ({
    ...item,
    contentDetails: detailsResponse.data?.items[index]?.contentDetails,
  }))
}

const playAudio = (video) => {
  // reproduce the audio using the videoId
  musicReproductorStore.setVideoId(video.id.videoId)
  musicReproductorStore.current = video
  musicReproductorStore.setShowPlayer(true)
}

const downloadAudio = (videoId) => {
  console.log('🚀 ~ downloadAudio ~ videoId:', videoId)
  // Implement download audio functionality
}
</script>
