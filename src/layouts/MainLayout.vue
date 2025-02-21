<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container class="top-safe-area" style="max-width: 900px; margin: auto">
      <MainHomePage v-show="currentTab === 'home'" />
      <MainMusicPage v-show="currentTab === 'music'" />
      <MainSearchPage v-show="currentTab === 'search'" />
      <MainSettingsPage v-show="currentTab === 'settings'" />
      <NavBar @change-tab="handleChangeTab" />
    </q-page-container>
  </q-layout>
  <div id="player"></div>
  <audio ref="audioRef" :src="`data:audio/mp3;base64,${audio}`" autobuffer="autobuffer" />
  <q-dialog seamless v-model="musicReproductorStore.showPlayer" position="bottom">
    <q-card flat style="width: 350px; margin-bottom: 64px">
      <q-slider
        v-if="validate(musicReproductorStore.current.id.videoId)"
        @update:model-value="handleTimePositionChange"
        v-model="currentTime"
        :min="0"
        :max="audioRef.duration"
        thumb-size="0px"
      />
      <q-card-section>
        <div class="row">
          <div class="col-2" @click="handleShowReproductorOnFullScreen">
            <img
              :src="
                musicReproductorStore.current.thumbnail
                  ? `data:image/jpeg;base64,${musicReproductorStore.current.thumbnail}`
                  : musicReproductorStore.current.snippet.thumbnails.default.url
              "
              alt="thumbnail"
              style="width: 50px; height: 50px; border-radius: 8px"
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
            <q-btn dense :ripple="false" @click="back" flat round icon="fast_rewind" />
            <q-btn
              dense
              :ripple="false"
              v-if="isPaused"
              @click="play"
              flat
              round
              icon="play_arrow"
            />
            <q-btn dense :ripple="false" v-else @click="pause" flat round icon="pause" />
            <q-btn dense :ripple="false" @click="next" flat round icon="fast_forward" />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>

  <q-dialog persistent maximized v-model="showPlayerOnFullScreen">
    <q-card
      flat
      class="bg-dark text-white"
      style="height: 100vh; display: flex; flex-direction: column"
    >
      <q-card-section class="row justify-between items-center q-pa-md">
        <q-btn flat round dense icon="arrow_back" @click="handleHideReproductorOnFullScreen" />
        <q-space />
        <q-btn
          v-if="validate(musicReproductorStore.current.id.videoId)"
          flat
          round
          dense
          icon="edit"
          @click="handleEditCurrentMusic"
        />
      </q-card-section>
      <q-card-section>
        <div class="text-h6 text-center">
          {{ musicReproductorStore.current.snippet.title }}
        </div>
        <div class="text-center text-caption text-grey-8">
          {{ musicReproductorStore.current.snippet.artist }}
        </div>
        <div class="text-center text-caption text-grey-8">
          {{ musicReproductorStore.current.snippet.album }}
        </div>
      </q-card-section>

      <q-card-section class="flex flex-center" style="flex-grow: 1">
        <img
          :src="
            musicReproductorStore.current.thumbnail
              ? `data:image/jpeg;base64,${musicReproductorStore.current.thumbnail}`
              : musicReproductorStore.current.snippet.thumbnails.default.url
          "
          alt="thumbnail-background"
          style="width: 100%; height: 100%; border-radius: 8px; z-index: 1; filter: blur(10px)"
        />
        <img
          :src="
            musicReproductorStore.current.thumbnail
              ? `data:image/jpeg;base64,${musicReproductorStore.current.thumbnail}`
              : musicReproductorStore.current.snippet.thumbnails.default.url
          "
          alt="thumbnail"
          style="
            max-width: 80%;
            max-height: 60vh;
            border-radius: 8px;
            z-index: 2;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          "
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
        <q-slider
          v-if="validate(musicReproductorStore.current.id.videoId)"
          @update:model-value="handleTimePositionChange"
          v-model="currentTime"
          :min="0"
          :max="audioRef.duration"
        />
      </q-card-section>
      <q-card-section class="row justify-center q-pa-md">
        <q-btn :ripple="false" @click="back" flat round icon="fast_rewind" size="lg" />

        <q-btn
          :ripple="false"
          @click="isPaused ? play() : pause()"
          size="40px"
          dense
          color="primary"
          round
          :icon="isPaused ? 'play_arrow' : 'pause'"
          class="q-mx-md"
        />

        <q-btn :ripple="false" @click="next" flat round icon="fast_forward" size="lg" />
      </q-card-section>
      <q-card-section>
        <div class="row">
          <div class="col-4"></div>
          <div class="col-4 text-center">
            <q-btn
              :ripple="false"
              @click="musicReproductorStore.repeat = !musicReproductorStore.repeat"
              :color="musicReproductorStore.repeat ? 'primary' : 'white'"
              flat
              round
              icon="repeat"
              size="md"
            />
            <q-btn
              :ripple="false"
              :color="musicReproductorStore.random ? 'primary' : 'white'"
              @click="musicReproductorStore.random = !musicReproductorStore.random"
              flat
              dense
              rounded
              icon="shuffle"
              size="md"
            />
          </div>
          <div class="col-4 text-right">
            <q-btn
              :ripple="false"
              @click="() => handleShowAddToPlaylist(musicReproductorStore.current.id.videoId)"
              flat
              round
              icon="playlist_add"
              size="md"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
  <q-dialog v-model="showEditMusic" maximized persistent>
    <q-card flat>
      <q-card-section class="row justify-between items-center q-pa-md">
        <q-btn flat round dense icon="arrow_back" @click="showEditMusic = false" />
      </q-card-section>
      <q-card-section>
        <EditForm @submit="handleMusicEditSubmit" :music="currentMusicToEdit" />
      </q-card-section>
    </q-card>
  </q-dialog>
  <!-- Add music to playlist -->
  <q-dialog v-model="showAddToPlaylist" maximized persistent>
    <q-card flat>
      <q-card-section class="text-h6">
        <q-btn flat round dense icon="arrow_back" @click="showAddToPlaylist = false" />
        {{ $t('action.addToPlaylist') }}
      </q-card-section>
      <q-card-section>
        <div class="row q-col-gutter-sm">
          <template v-if="musicStore.playlists.length === 0">
            <div class="col-12 q-my-lg text-center">
              <div class="q-mb-md">
                {{ $t('messages.youNoHavePlaylistsCreated') }}
              </div>
              <q-btn
                rounded
                color="primary"
                icon="add"
                @click="() => (showPlaylistCreationForm = true)"
                :label="$t('action.createPlayList')"
              />
            </div>
          </template>
          <div class="col-12" v-for="(playlist, index) in musicStore.playlists" :key="index">
            <play-list-card-mini :music="musicToAddToPlaylist" :playlist="playlist" />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
  <q-dialog maximized v-model="showPlaylistCreationForm" persistent>
    <q-card flat>
      <q-card-section class="text-h6">
        <q-btn
          flat
          round
          dense
          icon="arrow_back"
          @click="() => (showPlaylistCreationForm = false)"
        />
        {{ $t('action.createPlayList') }}
      </q-card-section>
      <q-card-section>
        <play-list-creation-form @created="handleSubmitPlaylistCreation" />
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
import { readMusic, readThumbnail } from 'src/utils/file'
import { validate } from 'uuid'

import MainHomePage from 'src/pages/IndexPage.vue'
import MainMusicPage from 'src/pages/music/MainMusic.vue'
import MainSearchPage from 'src/pages/MainSearch.vue'
import MainSettingsPage from 'src/pages/MainSettings.vue'
import EditForm from 'components/music/EditForm.vue'
import PlayListCardMini from 'src/components/playlist/PlayListCardMini.vue'
import PlayListCreationForm from 'src/components/playlist/PlayListCreationForm.vue'

const player = ref(null)
const isPaused = ref(false)
const playbackTime = ref('0:00') // Store current playback time
let updateTimeInterval = null // Store interval ID
const audio = ref(null)
const audioRef = ref(null)
const showPlayerOnFullScreen = ref(false)
const currentTab = ref('home')
const currentTime = ref(0)
const currentMusicToEdit = ref({})
const showEditMusic = ref(false)
const musicToAddToPlaylist = ref(null)
const showAddToPlaylist = ref(false)
const showPlaylistCreationForm = ref(false)

const musicReproductorStore = useMusicReproductor()
const musicStore = useMusicStore()
const { videoId } = storeToRefs(musicReproductorStore)

const handleChangeTab = (tab) => {
  currentTab.value = tab
}

const handleSubmitPlaylistCreation = () => {
  showPlaylistCreationForm.value = false
}

const handleShowAddToPlaylist = (uuid) => {
  const music = musicStore.downloaded.find((m) => m.uuid === uuid)
  musicToAddToPlaylist.value = music
  showAddToPlaylist.value = true
}

const handleShowReproductorOnFullScreen = () => {
  musicReproductorStore.showPlayer = false
  showPlayerOnFullScreen.value = true
}

const handleHideReproductorOnFullScreen = () => {
  showPlayerOnFullScreen.value = false
  musicReproductorStore.showPlayer = true
}

const handleTimePositionChange = () => {
  if (validate(musicReproductorStore.current.id.videoId)) {
    audioRef.value.currentTime = currentTime.value
  }
}

// Function to update playback time
const updatePlaybackTime = async () => {
  if (!player.value) return
  const audioCurrentTime = validate(musicReproductorStore.current.id.videoId)
    ? audioRef.value.currentTime
    : await player.value.getCurrentTime()
  playbackTime.value = formatTime(audioCurrentTime)

  if (validate(musicReproductorStore.current.id.videoId)) {
    currentTime.value = audioCurrentTime
  }
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

const handleEditCurrentMusic = () => {
  const music = musicStore.downloaded.find(
    (music) => music.uuid === musicReproductorStore.current.id.videoId,
  )
  currentMusicToEdit.value = music
  showEditMusic.value = true
}

const handleMusicEditSubmit = (music) => {
  const index = musicStore.downloaded.findIndex((m) => m.uuid === music.uuid)
  musicStore.downloaded[index] = {
    ...musicStore.downloaded[index],
    title: music.title,
    artist: music.artist,
    album: music.album,
  }
  // update current music
  musicReproductorStore.current = getCurrentMusicStructured(music)
  showEditMusic.value = false
}

onMounted(() => {
  musicReproductorStore.showPlayer = false
  player.value = YoutubePlayer('player', {
    height: '0',
    width: '0',
    videoId: videoId.value,
  })

  player.value.on('stateChange', (event) => {
    if (event.data === 1) {
      // Playing
      startPlaybackTimer()
    } else {
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
      const index = musicStore.downloaded.findIndex(
        (music) => music.uuid === musicReproductorStore.current.id.videoId,
      )
      if (musicStore.downloaded[index].playTimes) {
        musicStore.downloaded[index].playTimes++
      } else {
        musicStore.downloaded[index].playTimes = 1
      }
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

      // read the thumbnail from local
      const thumbnail = await readThumbnail(newVideoId)
      if (thumbnail) {
        musicReproductorStore.current.thumbnail = thumbnail
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
        album: musicReproductorStore.current.snippet.album,
        artist: musicReproductorStore.current.snippet.artist,
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
    const randomIndex = Math.floor(Math.random() * musicStore.currentPlayList.length)
    const music = musicStore.currentPlayList[randomIndex]
    musicReproductorStore.setVideoId(music.uuid)
    musicReproductorStore.lastMusic = musicReproductorStore.current
    musicReproductorStore.current = getCurrentMusicStructured(music)
  } else {
    const index = musicStore.currentPlayList.findIndex(
      (music) => music.uuid === musicReproductorStore.current.id.videoId,
    )
    let lastMusic = null
    if (index === musicStore.currentPlayList.length - 1) {
      const music = musicStore.currentPlayList[0]
      musicReproductorStore.setVideoId(music.uuid)
      musicReproductorStore.current = getCurrentMusicStructured(music)
      lastMusic = getCurrentMusicStructured(music)
    } else {
      const music = musicStore.currentPlayList[index + 1]
      musicReproductorStore.setVideoId(music.uuid)
      musicReproductorStore.current = getCurrentMusicStructured(music)
      lastMusic = getCurrentMusicStructured(music)
    }

    musicReproductorStore.lastMusic = lastMusic
  }
  isPaused.value = false
}

const back = () => {
  if (musicReproductorStore.random) {
    if (musicReproductorStore.lastMusic.id.videoId) {
      musicReproductorStore.setVideoId(musicReproductorStore.lastMusic.id.videoId)
      musicReproductorStore.current = musicReproductorStore.lastMusic
    } else {
      const fistTrack = musicStore.currentPlayList[0]
      musicReproductorStore.setVideoId(fistTrack.uuid)
      musicReproductorStore.current = getCurrentMusicStructured(fistTrack)
    }
  } else {
    const index = musicStore.currentPlayList.findIndex(
      (music) => music.uuid === musicReproductorStore.current.id.videoId,
    )
    let lastMusic = null
    if (index === 0) {
      const music = musicStore.currentPlayList[musicStore.currentPlayList.length - 1]
      musicReproductorStore.setVideoId(music.uuid)
      musicReproductorStore.current = getCurrentMusicStructured(music)
      lastMusic = getCurrentMusicStructured(music)
    } else {
      const music = musicStore.currentPlayList[index - 1]
      musicReproductorStore.setVideoId(music.uuid)
      musicReproductorStore.current = getCurrentMusicStructured(music)
      lastMusic = getCurrentMusicStructured(music)
    }

    musicReproductorStore.lastMusic = lastMusic
  }
  isPaused.value = false
}

// READ when the track finish to jump to the next track

// Cleanup on component unmount
onUnmounted(() => {
  stopPlaybackTimer()
})
</script>
