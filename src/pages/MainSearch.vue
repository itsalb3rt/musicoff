<template>
  <q-page padding>
    <q-input
      outlined
      v-model="query"
      placeholder="Search YouTube videos"
      @keyup.enter="searchVideos"
    />
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
          </div>
          <div class="col-12">
            <q-btn
              :color="
                musicReproductorStore.current.id.videoId === video.id.videoId ? 'green' : 'dark'
              "
              rounded
              outline
              class="q-mr-sm"
              @click="playAudio(video)"
              icon="play_arrow"
            />
            <q-btn rounded outline @click="downloadAudio(video.id.videoId)" icon="download" />
          </div>
        </div>
      </q-card-section>
    </q-card>
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
