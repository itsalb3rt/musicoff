<template>
  <q-page padding>
    <q-input
      outlined
      v-model="query"
      placeholder="Search YouTube videos"
      @keyup.enter="searchVideos"
    >
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
      <template v-slot:append>
        <q-btn flat round icon="close" v-if="query" @click="query = ''" />
      </template>
      <!-- Add button to search for mobile -->
      <template v-slot:after>
        <q-btn :loading="loadingSearch" flat round icon="search" @click="searchVideos" />
      </template>
    </q-input>

    <template v-if="videos.length === 0">
      <div class="text-h6 text-center text-grey" style="margin-top: 50%">
        {{ $t('messages.searchForVideos') }}
      </div>
    </template>

    <q-card flat bordered class="q-my-md" v-for="video in videos" :key="video.id.videoId">
      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-3">
            <q-img :src="video.snippet.thumbnails.default.url" alt="thumbnail" />
          </div>
          <div class="col-9">
            <div>{{ video.snippet.title }}</div>
            <div caption>{{ video.snippet.channelTitle }}</div>
            <div caption>{{ video?.contentDetails?.duration }}</div>
            <div caption>{{ formatYouTubeDuration(video?.contentDetails?.duration) }}</div>
          </div>
          <div class="col-12">
            <q-btn
              :color="
                musicReproductorStore?.current?.id?.videoId === video.id.videoId
                  ? 'primary'
                  : 'dark'
              "
              rounded
              outline
              class="q-mr-sm"
              @click="playAudio(video)"
              icon="play_arrow"
            />
            <q-btn
              :loading="downloadingVideoId === video.id.videoId"
              rounded
              outline
              @click="downloadAudio(video.id.videoId)"
              icon="download"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
    <div style="height: 100px" />
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useMusicReproductor } from 'src/stores/MusicReproductor'
import { formatYouTubeDuration } from 'src/utils/functions'

const musicReproductorStore = useMusicReproductor()

const query = ref('')
const videos = ref([])
const loadingSearch = ref(false)
const downloadingVideoId = ref('')

const searchVideos = async () => {
  loadingSearch.value = true
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

  loadingSearch.value = false
}

const playAudio = (video) => {
  // reproduce the audio using the videoId
  musicReproductorStore.setVideoId(video.id.videoId)
  musicReproductorStore.current = video
  musicReproductorStore.setShowPlayer(true)
}

const downloadAudio = (videoId) => {
  downloadingVideoId.value = videoId
  fetch('http://localhost:4000/download-audio', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url: `https://www.youtube.com/watch?v=${videoId}` }),
  })
    .then((response) => response.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(new Blob([blob]))
      const link = document.createElement('a')
      link.href
      link.setAttribute('href', url)
      link.setAttribute('download', 'audio.mp3')
      link.click()
    })
    .catch((error) => console.error('🚀 ~ downloadAudio ~ error', error))
    .finally(() => {
      downloadingVideoId.value = ''
    })
}
</script>
