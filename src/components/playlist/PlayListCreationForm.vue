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
    <div>{{ $t('common.myMusic') }} ({{ musicStore.getDownloaded.length }})</div>
    <q-scroll-area style="height: 50vh; max-width: 100%" visible>
      <div class="q-my-sm" v-for="music in musicStore.getDownloaded" :key="music.uuid">
        <music-card
          :enabled-highlight="false"
          :allow-play="false"
          :show-options="false"
          :music="music"
        >
          <template v-slot:extra-options>
            <div class="col-1">
              <q-btn
                :color="isSelected(music) ? 'green' : 'primary'"
                rounded
                dense
                class="float-right"
                :icon="isSelected(music) ? 'playlist_add_check' : 'playlist_add'"
                @click="
                  () => (isSelected(music) ? handleRemoveMusic(music) : handleAddMusic(music))
                "
              />
            </div>
          </template>
        </music-card>
      </div>
    </q-scroll-area>
    <div class="text-center q-pt-md">
      <q-btn :disable="!name" :label="$t('action.savePlaylist')" type="submit" color="primary" />
    </div>
  </q-form>
</template>

<script setup>
import { ref } from 'vue'
import MusicCard from 'components/music/MusicCard.vue'
import { useMusicStore } from 'src/stores/Music'
import { v4 } from 'uuid'

const emit = defineEmits(['created'])

const name = ref('')
const selection = ref([])
const musicStore = useMusicStore()

const handleAddMusic = (music) => {
  selection.value.push(music)
}
const handleRemoveMusic = (music) => {
  selection.value = selection.value.filter((m) => m.uuid !== music.uuid)
}

const isSelected = (music) => selection.value.some((m) => m.uuid === music.uuid)

const onSubmit = () => {
  musicStore.addPlayList({ name: name.value, musics: selection.value, uuid: v4() })
  emit('created')
}
</script>
