<template>
  <q-page padding>
    <p class="text-h5">
      {{ $t('common.music') }}
    </p>
    <q-input
      rounded
      outlined
      v-model="query"
      :placeholder="$t('common.search')"
      debounce="500"
      @update:model-value="search"
    >
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
    </q-input>
    <p class="text-center text-grey q-my-md">
      {{ musicFiltered.length }} {{ $t('common.downloadedMusic') }}
    </p>

    <div class="text-center q-mb-md" v-if="musicStore.downloaded.length > 0">
      <q-btn
        rounded
        icon="shuffle"
        color="primary"
        :label="$t('common.random')"
        @click="musicFiltered.value = musicStore.downloaded"
      />
    </div>

    <div class="q-my-sm" v-for="music in musicFiltered" :key="music.uuid">
      <music-card :music="music" />
    </div>

    <template v-if="musicFiltered.length === 0">
      <p class="text-center text-grey">
        {{ $t('messages.noResults') }}
      </p>
    </template>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useMusicStore } from 'src/stores/Music'
import MusicCard from 'components/music/MusicCard.vue'

const musicStore = useMusicStore()
const musicFiltered = ref(musicStore.downloaded)
const query = ref('')

const search = () => {
  musicFiltered.value = musicStore.downloaded.filter((music) =>
    music.title.toLowerCase().includes(query.value.toLowerCase()),
  )
}
</script>
