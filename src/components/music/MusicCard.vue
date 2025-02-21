<template>
  <q-card
    :class="
      enabledHighlight && musicReproductorStore.current.id.videoId === music.uuid
        ? 'bg-primary'
        : ''
    "
    flat
  >
    <q-card-section>
      <div class="row items-center q-col-gutter-md">
        <div @click="() => playAudio()" class="col-3" style="position: relative">
          <q-img :src="music.thumbnail" alt="thumbnail" />
          <q-btn
            v-show="allowPlay"
            style="position: absolute; top: 60%; left: 50%; transform: translate(-50%, -50%)"
            dense
            rounded
            outline
            class="q-mr-sm"
            icon="play_arrow"
          />
        </div>
        <div class="col-8" @click="() => playAudio()">
          <div>{{ music.title }}</div>
          <div caption>{{ formatYouTubeDuration(music.duration) }}</div>
          <div
            v-if="showPlayTimes"
            :class="`text-caption ${musicReproductorStore.current.id.videoId === music.uuid ? 'text-white' : 'text-grey-8'}`"
          >
            {{ $t('common.playTimes') }}: {{ music.playTimes ? formatNumber(music.playTimes) : 0 }}
          </div>
        </div>
        <!-- This is used to replace the default options -->
        <slot name="extra-options" />

        <div v-if="showOptions" class="col-1">
          <q-btn dense class="float-right" icon="more_vert" flat round>
            <q-menu class="dark-mode-shadow">
              <q-list style="min-width: 200px">
                <q-item
                  v-if="enabledReDownload"
                  @click="() => reDownload()"
                  clickable
                  v-close-popup
                >
                  <q-item-section avatar>
                    <q-icon color="primary" name="download" />
                  </q-item-section>
                  <q-item-section class="flex no-wrap">
                    {{ music.downloaded ? $t('action.reDownload') : $t('action.download') }}
                  </q-item-section>
                </q-item>
                <q-separator v-if="enabledReDownload" spaced inset />
                <q-item @click="() => (showDeleteDialog = true)" clickable v-close-popup>
                  <q-item-section avatar>
                    <q-icon color="negative" name="delete" />
                  </q-item-section>
                  <q-item-section>
                    {{ $t('action.delete') }}
                  </q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </div>
    </q-card-section>
  </q-card>
  <q-dialog v-model="showDeleteDialog">
    <q-card flat>
      <q-card-section>
        {{ $t('messages.areYouSureYouWantToDelete') }}
      </q-card-section>
      <q-card-actions align="center">
        <q-btn rounded push @click="showDeleteDialog = false" label="No" />
        <q-btn rounded push @click="dispatchDeleteMusic" color="negative" label="Yes" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { formatYouTubeDuration, getCurrentMusicStructured, formatNumber } from 'src/utils/functions'
import { useMusicReproductor } from 'src/stores/MusicReproductor'
import { useMusicStore } from 'src/stores/Music'
import { deleteMusic, deleteThumbnail } from 'src/utils/file'

const props = defineProps({
  music: Object,
  showPlayTimes: Boolean,
  showOptions: {
    type: Boolean,
    default: true,
  },
  allowPlay: {
    type: Boolean,
    default: true,
  },
  enabledHighlight: {
    type: Boolean,
    default: true,
  },
  enabledReDownload: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['delete', 'play', 'reDownload'])

const showDeleteDialog = ref(false)

const musicReproductorStore = useMusicReproductor()
const musicStore = useMusicStore()

const dispatchDeleteMusic = () => {
  musicStore.remove(props.music.uuid)
  showDeleteDialog.value = false
  emit('delete', props.music.uuid)

  // Delete the music and thumbnail
  deleteMusic(props.music.uuid)
  deleteThumbnail(props.music.uuid)
}

const playAudio = () => {
  if (!props.allowPlay) {
    return
  }

  // Track the last music played
  if (musicReproductorStore.current.id.videoId) {
    musicReproductorStore.lastMusic = musicReproductorStore.current
  }

  // reproduce the audio using the videoId
  musicReproductorStore.setVideoId(props.music.uuid)
  musicReproductorStore.current = getCurrentMusicStructured(props.music)
  musicReproductorStore.setShowPlayer(true)
  emit('play')
}

const reDownload = () => {
  emit('reDownload', props.music.uuid)
}

defineExpose({
  playAudio,
})
</script>
