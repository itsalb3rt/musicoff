<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container class="top-safe-area" style="max-width: 900px; margin: auto">
      <router-view />
      <NavBar />
    </q-page-container>
  </q-layout>
  <div id="player"></div>
  <q-dialog seamless v-model="musicReproductorStore.showPlayer" position="bottom">
    <q-card style="width: 350px; margin-bottom: 80px">
      <q-linear-progress :value="0.6" color="pink" />

      <q-card-section>
        <div class="row">
          <div class="col-2">
            <img
              :src="musicReproductorStore.current.snippet.thumbnails.default.url"
              alt="thumbnail"
              style="width: 50px; height: 50px"
            />
          </div>
          <div class="col-6">
            <div class="text-weight-bold ellipsis">
              {{ musicReproductorStore.current.snippet.title }}
            </div>
            <div class="text-caption ellipsis">
              {{ musicReproductorStore.current.snippet.channelTitle }}
            </div>
            <div class="text-caption ellipsis">
              {{ playbackTime }} /
              {{ formatYouTubeDuration(musicReproductorStore.current?.contentDetails?.duration) }}
            </div>
          </div>
          <div class="col-4">
            <q-btn disable flat round icon="fast_rewind" />
            <q-btn v-if="isPaused" @click="play" flat round icon="play_arrow" />
            <q-btn v-else @click="pause" flat round icon="pause" />
            <q-btn disable flat round icon="fast_forward" />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { ref, watch, onMounted, onUnmounted } from 'vue'
import NavBar from 'components/NavBar.vue'
import { useMusicReproductor } from 'src/stores/MusicReproductor'
import YoutubePlayer from 'youtube-player'
import { formatYouTubeDuration } from 'src/utils/functions'

const player = ref(null)
const isPaused = ref(false)
const playbackTime = ref('0:00') // Store current playback time
let updateTimeInterval = null // Store interval ID

const musicReproductorStore = useMusicReproductor()
const { videoId } = storeToRefs(musicReproductorStore)

// Function to update playback time
const updatePlaybackTime = async () => {
  if (!player.value) return
  const currentTime = await player.value.getCurrentTime()
  playbackTime.value = formatTime(currentTime)
}

// Function to format seconds to MM:SS
const formatTime = (seconds) => {
  const min = Math.floor(seconds / 60)
  const sec = Math.floor(seconds % 60)
  return `${min}:${sec.toString().padStart(2, '0')}`
}

// Function to start updating playback time
const startPlaybackTimer = () => {
  if (updateTimeInterval) clearInterval(updateTimeInterval)
  updateTimeInterval = setInterval(updatePlaybackTime, 1000)
}

// Function to stop updating playback time
const stopPlaybackTimer = () => {
  clearInterval(updateTimeInterval)
}

onMounted(() => {
  player.value = YoutubePlayer('player', {
    height: '0',
    width: '0',
    videoId: videoId.value,
  })

  player.value.on('stateChange', (event) => {
    if (event.data === 1) {
      // Playing
      isPaused.value = false
      startPlaybackTimer()
    } else {
      isPaused.value = true
      stopPlaybackTimer()
    }
  })
})

watch(
  videoId,
  (newVideoId) => {
    console.log(musicReproductorStore.current)
    player.value.loadVideoById(newVideoId)
    isPaused.value = false
    playbackTime.value = '0:00' // Reset playback time
  },
  { deep: true },
)

const pause = () => {
  isPaused.value = true
  player.value.pauseVideo()
  stopPlaybackTimer()
}

const play = () => {
  isPaused.value = false
  player.value.playVideo()
  startPlaybackTimer()
}

// Cleanup on component unmount
onUnmounted(() => {
  stopPlaybackTimer()
})
</script>
