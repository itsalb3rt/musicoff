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

    <div class="text-center" v-if="musicStore.someNonDownloaded">
      <p class="text-center text-grey q-mt-md">
        {{ $t('common.nonDownloadedMusic') }}
      </p>
      <q-btn
        @click="handleDownloadAll"
        icon="cloud_download"
        color="primary"
        rounded
        class="q-mt-md"
        :label="$t('action.downloadAll')"
      />
    </div>

    <p class="text-center text-grey q-my-md">
      {{ musicFiltered.length }} {{ $t('common.downloadedMusic') }}
    </p>

    <div class="q-my-sm" v-for="music in musicFiltered" :key="music.uuid">
      <music-card @delete="handleDeleteMusic" :music="music" />
    </div>
    <!-- To avoid hide the last track -->
    <div style="height: 100px" />

    <template v-if="musicFiltered.length === 0">
      <p class="text-center text-grey">
        {{ $t('messages.noResults') }}
      </p>
    </template>
    <q-dialog maximized="" v-model="showLoadingDownloadAllDialog" persistent>
      <q-card class="text-center">
        <q-card-section style="margin-top: 50%">
          <q-spinner-gears size="50px" />
          <p class="text-h6 q-mt-md">
            {{ $t('common.downloading') }} {{ currentDownloadNumber }} / {{ totalDownloadNumber }}
          </p>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useMusicStore } from 'src/stores/Music'
import MusicCard from 'components/music/MusicCard.vue'
import { useSettingsStore } from 'src/stores/Settings'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { saveMusic } from 'src/utils/file'

const $q = useQuasar()
const $t = useI18n().t
const settingsStore = useSettingsStore()
const downloadingVideoId = ref('')
const musicStore = useMusicStore()
const musicFiltered = ref(musicStore.getDownloaded)
const query = ref('')
const currentDownloadNumber = ref(0)
const totalDownloadNumber = ref(0)
const showLoadingDownloadAllDialog = ref(false)

const search = () => {
  musicFiltered.value = musicStore.getDownloaded.filter((music) =>
    music.title.toLowerCase().includes(query.value.toLowerCase()),
  )
}

const handleDeleteMusic = () => {
  musicFiltered.value = musicStore.getDownloaded
}

const downloadAudio = (videoId) => {
  if (!settingsStore.server) {
    $q.notify({
      message: $t('error.serverNotConfigured'),
      color: 'negative',
    })
    return
  }

  downloadingVideoId.value = videoId
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`
  return fetch(settingsStore.server, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url: videoUrl }),
  })
    .then((response) => response.json())
    .then(async (response) => {
      const index = musicStore.getDownloaded.findIndex((music) => music.originId === videoId)
      const uuid = musicStore.getDownloaded[index].uuid

      saveMusic({
        uuid: uuid,
        file: response.audio_base64,
      })

      musicStore.downloaded[index].downloaded = true
    })
    .catch((error) => console.error('🚀 ~ downloadAudio ~ error', error))
    .finally(() => {
      downloadingVideoId.value = ''
      return
    })
}

const handleDownloadAll = async () => {
  const toDownload = musicStore.getDownloaded.filter((music) => !music.downloaded)
  currentDownloadNumber.value = 0
  totalDownloadNumber.value = toDownload.length

  showLoadingDownloadAllDialog.value = true

  for (const music of toDownload) {
    await downloadAudio(music.originId)
    currentDownloadNumber.value++
  }

  $q.notify({
    message: $t('messages.allDownloaded'),
    color: 'positive',
  })

  showLoadingDownloadAllDialog.value = false
}
</script>
