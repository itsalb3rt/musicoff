<template>
  <div>
    <div class="text-h6 text-center">
      {{ playlist.name }}
    </div>
    <div class="text-center q-my-lg">
      <q-btn @click="handlePlay" rounded color="primary" :label="$t('action.play')" />
    </div>
    <div class="q-my-sm" v-for="(music, index) in playlist.musics" :key="index">
      <music-card
        :ref="(ref) => (musicaCardRefs[index] = ref)"
        @play="addPlaylistToCurrentPlaylist"
        :music="music"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import MusicCard from 'components/music/MusicCard.vue'
import { useMusicStore } from 'src/stores/Music'

const musicStore = useMusicStore()
const musicaCardRefs = ref([])

const props = defineProps({
  playlist: Object,
})

const addPlaylistToCurrentPlaylist = () => {
  musicStore.currentPlayList = [...props.playlist.musics]
}

const handlePlay = () => {
  musicStore.currentPlayList = [...props.playlist.musics]
  console.log(musicaCardRefs.value[0].playAudio())
}
</script>
