<template>
  <q-page padding>
    <p class="text-h3 q-my-lg text-center">
      {{ $t('common.search') }}
    </p>
    <q-input
      rounded
      outlined
      v-model="query"
      :placeholder="$t('messages.searchYoutubeVideos')"
      @keyup.enter="searchVideos"
      @blur="searchVideos"
    >
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
      <template v-slot:append>
        <q-btn flat round icon="close" v-if="query" @click="query = ''" />
      </template>
      <template v-slot:after>
        <q-btn :loading="loadingSearch" flat round icon="search" @click="searchVideos" />
      </template>
    </q-input>

    <template v-if="videos.length === 0">
      <div class="text-h6 text-center text-grey" style="margin-top: 50%">
        {{ $t('messages.searchForVideos') }}
      </div>
    </template>

    <q-card flat class="q-my-md" v-for="video in videos" :key="video.id.videoId">
      <q-card-section>
        <div class="row items-center q-col-gutter-md">
          <div class="col-3" style="position: relative" @click="playAudio(video)">
            <q-img :src="video.snippet.thumbnails.default.url" alt="thumbnail" />
            <q-btn
              style="position: absolute; top: 60%; left: 50%; transform: translate(-50%, -50%)"
              dense
              :color="
                musicReproductorStore?.current?.id?.videoId === video.id.videoId ? 'primary' : ''
              "
              rounded
              outline
              class="q-mr-sm"
              icon="play_arrow"
            />
          </div>
          <div class="col-7" @click="playAudio(video)">
            <div>{{ video.snippet.title }}</div>
            <div caption>{{ video.snippet.channelTitle }}</div>
            <div caption>{{ formatYouTubeDuration(video?.contentDetails?.duration) }}</div>
          </div>
          <div class="col-2">
            <q-btn
              dense
              :disable="musicStore.isDownloaded(video.id.videoId)"
              :loading="downloadingVideoId === video.id.videoId"
              rounded
              outline
              @click="downloadAudio(video.id.videoId)"
              :icon="musicStore.isDownloaded(video.id.videoId) ? 'check' : 'download'"
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
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import axios from 'axios'
import { useMusicReproductor } from 'src/stores/MusicReproductor'
import { formatYouTubeDuration } from 'src/utils/functions'
import { saveMusic, saveThumbnail } from 'src/utils/file'
import { v4 } from 'uuid'
import { useMusicStore } from 'src/stores/Music'
import { useSettingsStore } from 'src/stores/Settings'

const musicReproductorStore = useMusicReproductor()
const musicStore = useMusicStore()
const settingsStore = useSettingsStore()
const $q = useQuasar()
const $t = useI18n().t

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
      key: process.env.GOOGLE_API_KEY,
    },
  })

  const videoIds = response.data.items.map((item) => item.id.videoId).join(',')
  const detailsResponse = await axios.get('https://www.googleapis.com/youtube/v3/videos', {
    params: {
      part: 'contentDetails',
      id: videoIds,
      key: process.env.GOOGLE_API_KEY,
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
  if (!settingsStore.server) {
    $q.notify({
      message: $t('error.serverNotConfigured'),
      color: 'negative',
    })
    return
  }

  downloadingVideoId.value = videoId
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`
  fetch(settingsStore.server, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url: videoUrl }),
  })
    .then((response) => response.json())
    .then(async (response) => {
      const uuid = v4()
      const videoFromVideos = videos.value.find((video) => video.id.videoId === videoId)

      try {
        saveMusic({
          uuid: uuid,
          file: response.audio_base64,
        })

        saveThumbnail({
          uuid: uuid,
          file: response.thumbnail_base64,
        })

        musicStore.add({
          uuid: uuid,
          originId: videoId,
          title: videoFromVideos.snippet.title,
          duration: videoFromVideos?.contentDetails?.duration,
          thumbnail: videoFromVideos.snippet.thumbnails.default.url,
          artist: response.artist || undefined,
          downloaded: true,
          createdAt: new Date(),
        })
      } catch (error) {
        console.error('🚀 ~ downloadAudio ~ error', error)
        $q.notify({
          message: $t('error.downloadErrorPleaseTryAgain'),
          color: 'negative',
        })
      }
    })
    .catch((error) => {
      console.error('🚀 ~ downloadAudio ~ error', error)
      $q.notify({
        message: $t('error.downloadErrorPleaseTryAgain'),
        color: 'negative',
      })
    })
    .finally(() => {
      downloadingVideoId.value = ''
    })
}
</script>
