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
    <div class="text-center q-pY-md">
      <q-btn :disable="!name" :label="$t('action.savePlaylist')" type="submit" color="primary" />
    </div>
    <div>{{ $t('common.playlistMusic') }} ({{ playlist?.musics?.length || 0 }})</div>
    <p class="text-grey-8 text-center">
      {{ $t('messages.dragTheMusicToChangeTheOrder') }}
    </p>

    <draggable
      v-model="localPlaylistMusics"
      item-key="uuid"
      @start="drag = true"
      @end="handleEndGrad"
      class="list-group"
    >
      <template #item="{ element }">
        <div>
          <music-card
            :enabled-highlight="false"
            :show-options="false"
            :allow-play="false"
            :music="element"
          >
            <template v-slot:extra-options>
              <div class="col-1">
                <q-btn rounded dense flat class="float-right" icon="drag_indicator" />
              </div>
            </template>
          </music-card>
        </div>
      </template>
    </draggable>
  </q-form>
</template>

<script setup>
import { ref } from 'vue'
import draggable from 'vuedraggable'

import MusicCard from 'components/music/MusicCard.vue'
import { useMusicStore } from 'src/stores/Music'

const emit = defineEmits(['edited'])
const props = defineProps({
  playlist: Object,
})
const localPlaylistMusics = ref(props.playlist.musics)
const drag = ref(false)

const name = ref(props.playlist.name)
const musicStore = useMusicStore()

const handleEndGrad = () => {
  drag.value = false
  const index = musicStore.playlists.findIndex((playlist) => playlist.uuid === props.playlist.uuid)
  musicStore.playlists[index].musics = localPlaylistMusics.value
}

const onSubmit = () => {
  const index = musicStore.playlists.findIndex((playlist) => playlist.uuid === props.playlist.uuid)
  musicStore.playlists[index].name = name.value
  emit('edited')
}
</script>
