<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container class="top-safe-area" style="max-width: 900px; margin: auto">
      <router-view />
      <NavBar />
    </q-page-container>
  </q-layout>
  <div id="player"></div>
  <q-dialog seamless v-model="musicReproductorStore.showPlayer" position="bottom">
    <q-card style="width: 350px">
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
          </div>
          <div class="col-4">
            <q-btn flat round icon="fast_rewind" />
            <q-btn v-if="isPaused" @click="play" flat round icon="play_arrow" />
            <q-btn v-else @click="pause" flat round icon="pause" />
            <q-btn flat round icon="fast_forward" />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { ref, watch, onMounted } from 'vue'
import NavBar from 'components/NavBar.vue'
import { useMusicReproductor } from 'src/stores/MusicReproductor'
import YoutubePlayer from 'youtube-player'

const player = ref(null)
const isPaused = ref(false)

const musicReproductorStore = useMusicReproductor()

const { videoId } = storeToRefs(musicReproductorStore)

onMounted(() => {
  player.value = YoutubePlayer('player', {
    height: '0',
    width: '0',
    videoId: videoId.value,
  })

  player.value.on('stateChange', (event) => {
    console.log(event)
  })
})

watch(
  videoId,
  (newVideoId) => {
    // persist the whole state to the local storage whenever it changes
    console.log(musicReproductorStore.current)
    player.value.loadVideoById(newVideoId)
    isPaused.value = false
  },
  { deep: true },
)

const pause = () => {
  isPaused.value = true
  player.value.pauseVideo()
}

const play = () => {
  isPaused.value = false
  player.value.playVideo()
}
</script>
