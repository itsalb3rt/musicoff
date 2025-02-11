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
          <div class="col-2" @click="handleShowReproductorOnFullScreen">
            <img
              :src="musicReproductorStore.current.snippet.thumbnails.default.url"
              alt="thumbnail"
              style="width: 50px; height: 50px"
            />
          </div>
          <div class="col-6" @click="handleShowReproductorOnFullScreen">
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
            <q-btn dense @click="back" flat round icon="fast_rewind" />
            <q-btn dense v-if="isPaused" @click="play" flat round icon="play_arrow" />
            <q-btn dense v-else @click="pause" flat round icon="pause" />
            <q-btn dense @click="next" flat round icon="fast_forward" />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog maximized v-model="showPlayerOnFullScreen">
    <q-card class="bg-dark text-white" style="height: 100vh; display: flex; flex-direction: column">
      <q-card-section class="row justify-between items-center q-pa-md">
        <q-btn flat round dense icon="arrow_back" @click="handleHideReproductorOnFullScreen" />
      </q-card-section>
      <q-card-section>
        <div class="text-h6 text-center">
          {{ musicReproductorStore.current.snippet.title }}
        </div>
      </q-card-section>

      <q-card-section class="flex flex-center" style="flex-grow: 1">
        <img
          :src="musicReproductorStore.current.snippet.thumbnails.default.url"
          alt="thumbnail"
          style="max-width: 80%; max-height: 60vh; border-radius: 8px"
        />
      </q-card-section>

      <q-card-section class="q-pa-md">
        <div class="text-center text-caption">
          {{ musicReproductorStore.current.snippet.channelTitle }}
        </div>
        <div class="text-center text-caption">
          {{ playbackTime }} /
          {{ formatYouTubeDuration(musicReproductorStore.current?.contentDetails?.duration) }}
        </div>
        <q-linear-progress color="primary" class="q-mt-md" />
      </q-card-section>
      <q-card-section class="row justify-center q-pa-md">
        <q-btn
          @click="musicReproductorStore.repeat = !musicReproductorStore.repeat"
          :color="musicReproductorStore.repeat ? 'primary' : 'white'"
          flat
          round
          icon="repeat"
          size="md"
        />
        <q-btn @click="back" flat round icon="fast_rewind" size="lg" />
        <q-btn
          v-if="isPaused"
          @click="play"
          flat
          round
          icon="play_arrow"
          size="lg"
          class="q-mx-md"
        />
        <q-btn v-else @click="pause" flat round icon="pause" size="lg" class="q-mx-md" />
        <q-btn @click="next" flat round icon="fast_forward" size="lg" />

        <q-btn
          style="float: right"
          :color="musicReproductorStore.random ? 'primary' : 'white'"
          @click="musicReproductorStore.random = !musicReproductorStore.random"
          flat
          dense
          rounded
          icon="shuffle"
          size="md"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { ref, watch, onMounted, onUnmounted } from 'vue'
import NavBar from 'components/NavBar.vue'

import { useMusicReproductor } from 'src/stores/MusicReproductor'
import { useMusicStore } from 'src/stores/Music'

import YoutubePlayer from 'youtube-player'
import { formatYouTubeDuration, getCurrentMusicStructured } from 'src/utils/functions'
import { readMusic } from 'src/utils/file'
import { validate } from 'uuid'

const player = ref(null)
const isPaused = ref(false)
const playbackTime = ref('0:00') // Store current playback time
let updateTimeInterval = null // Store interval ID
const audio = ref(null)
const audioRef = ref(null)
const showPlayerOnFullScreen = ref(false)

const musicReproductorStore = useMusicReproductor()
const musicStore = useMusicStore()
const { videoId } = storeToRefs(musicReproductorStore)

const handleShowReproductorOnFullScreen = () => {
  musicReproductorStore.showPlayer = false
  showPlayerOnFullScreen.value = true
}

const handleHideReproductorOnFullScreen = () => {
  showPlayerOnFullScreen.value = false
  musicReproductorStore.showPlayer = true
}

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

  navigator.mediaSession.setActionHandler('previoustrack', () => {
    back()
  })

  navigator.mediaSession.setActionHandler('nexttrack', () => {
    next()
  })

  audioRef.value.onended = () => {
    if (musicReproductorStore.repeat) {
      if (validate(musicReproductorStore.current.id.videoId)) {
        audioRef.value.play()
      } else {
        player.value.playVideo()
      }
    } else {
      next()
    }
  }
})

watch(
  videoId,
  async (newVideoId) => {
    if (!validate(newVideoId)) {
      /// is a youtube video

      if (audioRef.value && audioRef.value.pause) {
        audioRef.value.pause()
      }

      player.value.loadVideoById(newVideoId)
    } else {
      if (player.value) {
        player.value.stopVideo()
      }
      playLocal(newVideoId)
    }

    isPaused.value = false
    playbackTime.value = '0:00' // Reset playback time
  },
  { deep: true },
)

const playLocal = async (uuid) => {
  audio.value = await readMusic(uuid)
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
    }
  }, 1000)
}

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

const next = () => {
  if (musicReproductorStore.random) {
    const randomIndex = Math.floor(Math.random() * musicStore.downloaded.length)
    const music = musicStore.downloaded[randomIndex]
    musicReproductorStore.setVideoId(music.uuid)
    musicReproductorStore.current = getCurrentMusicStructured(music)
    musicReproductorStore.lastMusic = getCurrentMusicStructured(music)
  } else {
    const index = musicStore.downloaded.findIndex(
      (music) => music.uuid === musicReproductorStore.current.id.videoId,
    )
    let lastMusic = null
    if (index === musicStore.downloaded.length - 1) {
      const music = musicStore.downloaded[0]
      musicReproductorStore.setVideoId(music.uuid)
      musicReproductorStore.current = getCurrentMusicStructured(music)
      lastMusic = getCurrentMusicStructured(music)
    } else {
      const music = musicStore.downloaded[index + 1]
      musicReproductorStore.setVideoId(music.uuid)
      musicReproductorStore.current = getCurrentMusicStructured(music)
      lastMusic = getCurrentMusicStructured(music)
    }

    musicReproductorStore.lastMusic = lastMusic
  }
}

const back = () => {
  if (musicReproductorStore.random) {
    if (musicReproductorStore.lastMusic.id.videoId) {
      musicReproductorStore.setVideoId(musicReproductorStore.lastMusic.id.videoId)
      musicReproductorStore.current = musicReproductorStore.lastMusic
    } else {
      const fistTrack = musicStore.downloaded[0]
      musicReproductorStore.setVideoId(fistTrack.uuid)
      musicReproductorStore.current = getCurrentMusicStructured(fistTrack)
    }
  } else {
    const index = musicStore.downloaded.findIndex(
      (music) => music.uuid === musicReproductorStore.current.id.videoId,
    )
    let lastMusic = null
    if (index === 0) {
      const music = musicStore.downloaded[musicStore.downloaded.length - 1]
      musicReproductorStore.setVideoId(music.uuid)
      musicReproductorStore.current = getCurrentMusicStructured(music)
      lastMusic = getCurrentMusicStructured(music)
    } else {
      const music = musicStore.downloaded[index - 1]
      musicReproductorStore.setVideoId(music.uuid)
      musicReproductorStore.current = getCurrentMusicStructured(music)
      lastMusic = getCurrentMusicStructured(music)
    }

    musicReproductorStore.lastMusic = lastMusic
  }
}

// READ when the track finish to jump to the next track

// Cleanup on component unmount
onUnmounted(() => {
  stopPlaybackTimer()
})
</script>
