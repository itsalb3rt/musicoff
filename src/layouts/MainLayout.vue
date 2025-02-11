<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container class="top-safe-area" style="max-width: 900px; margin: auto">
      <router-view />
      <NavBar />
    </q-page-container>
  </q-layout>
  <div id="player"></div>
  <audio ref="audioRef" :src="`data:audio/mp3;base64,${audio}`" autobuffer="autobuffer" />
  <q-dialog seamless v-model="musicReproductorStore.showPlayer" position="bottom">
    <q-card style="width: 350px; margin-bottom: 80px">
      <q-linear-progress v-if="!isPaused" color="primary" indeterminate />

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
            <q-btn dense disable flat round icon="fast_rewind" />
            <q-btn dense v-if="isPaused" @click="play" flat round icon="play_arrow" />
            <q-btn dense v-else @click="pause" flat round icon="pause" />
            <q-btn dense disable flat round icon="fast_forward" />
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
import { readMusic } from 'src/utils/file'
import { validate } from 'uuid'

const player = ref(null)
const isPaused = ref(false)
const playbackTime = ref('0:00') // Store current playback time
let updateTimeInterval = null // Store interval ID
const audio = ref(null)
const audioRef = ref(null)

const musicReproductorStore = useMusicReproductor()
const { videoId } = storeToRefs(musicReproductorStore)

// Function to update playback time
const updatePlaybackTime = async () => {
  if (!player.value) return
  const currentTime = validate(musicReproductorStore.current.id.videoId)
    ? audioRef.value.currentTime
    : await player.value.getCurrentTime()
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

  navigator.mediaSession.setActionHandler('play', async () => {
    play()
  })

  navigator.mediaSession.setActionHandler('pause', () => {
    pause()
  })
})

watch(
  videoId,
  async (newVideoId) => {
    if (!validate(newVideoId)) {
      /// is a youtube video
      player.value.loadVideoById(newVideoId)
    } else {
      audio.value = await readMusic(newVideoId)
      setTimeout(() => {
        audioRef.value.play()
        startPlaybackTimer()

        if ('mediaSession' in navigator) {
          navigator.mediaSession.metadata = new MediaMetadata({
            title: musicReproductorStore.current.snippet.title,
            artwork: [
              {
                src: musicReproductorStore.current.snippet.thumbnails.default.url,
                sizes: '96x96',
                type: 'image/png',
              },
              {
                src: musicReproductorStore.current.snippet.thumbnails.default.url,
                sizes: '128x128',
                type: 'image/png',
              },
              {
                src: musicReproductorStore.current.snippet.thumbnails.default.url,
                sizes: '192x192',
                type: 'image/png',
              },
              {
                src: musicReproductorStore.current.snippet.thumbnails.default.url,
                sizes: '256x256',
                type: 'image/png',
              },
              {
                src: musicReproductorStore.current.snippet.thumbnails.default.url,
                sizes: '384x384',
                type: 'image/png',
              },
              {
                src: musicReproductorStore.current.snippet.thumbnails.default.url,
                sizes: '512x512',
                type: 'image/png',
              },
            ],
          })

          // TODO: Update playback state.
        }
      }, 1000)
      // is local audio
    }

    isPaused.value = false
    playbackTime.value = '0:00' // Reset playback time
  },
  { deep: true },
)

const pause = () => {
  if (audioRef.value) {
    isPaused.value = true
    audioRef.value.pause()
    stopPlaybackTimer()
  } else {
    isPaused.value = true
    player.value.pauseVideo()
  }
  stopPlaybackTimer()
}

const play = () => {
  if (audioRef.value) {
    isPaused.value = false
    audioRef.value.play()
    startPlaybackTimer()
  } else {
    isPaused.value = false
    player.value.playVideo()
  }
  startPlaybackTimer()
}

// Cleanup on component unmount
onUnmounted(() => {
  stopPlaybackTimer()
})
</script>
