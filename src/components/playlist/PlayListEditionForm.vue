<template>
  <q-form @submit="onSubmit" class="q-gutter-md">
    <q-input
      outlined
      rounded
      v-model="name"
      :label="$t('common.name')"
      :placeholder="$t('messages.playlistPlaceHollder')"
      lazy-rules
      :rules="[(val) => (val && val.length > 0) || $t('error.requiredField')]"
    />
    <div>{{ $t('common.playlistMusic') }} ({{ playlist.musics.length }})</div>
    <div class="text-center q-pt-md">
      <q-btn :disable="!name" :label="$t('action.savePlaylist')" type="submit" color="primary" />
    </div>
  </q-form>
</template>

<script setup>
import { ref } from 'vue'
// import MusicCard from 'components/music/MusicCard.vue'
import { useMusicStore } from 'src/stores/Music'

const emit = defineEmits(['edited'])
const props = defineProps({
  playlist: Object,
})

const name = ref(props.playlist.name)
const musicStore = useMusicStore()

const onSubmit = () => {
  const index = musicStore.playlists.findIndex((playlist) => playlist.uuid === props.playlist.uuid)
  musicStore.playlists[index].name = name.value
  emit('edited')
}
</script>
