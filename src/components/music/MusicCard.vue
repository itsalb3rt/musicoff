<template>
  <q-card :class="musicReproductorStore.current.id.videoId === music.uuid ? 'bg-primary' : ''" flat>
    <q-card-section>
      <div class="row items-center q-col-gutter-md">
        <div @click="() => playAudio()" class="col-3" style="position: relative">
          <q-img :src="music.thumbnail" alt="thumbnail" />
          <q-btn
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
        <div v-if="showOptions" class="col-1">
          <q-btn dense class="float-right" icon="more_vert" flat round>
            <q-menu>
              <q-list style="min-width: 100px">
                <q-item @click="() => (showDeleteDialog = true)" clickable v-close-popup>
                  <q-item-section>{{ $t('action.delete') }}</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </div>
    </q-card-section>
  </q-card>
  <q-dialog v-model="showDeleteDialog">
    <q-card>
      <q-card-section>
        {{ $t('messages.areYouSureYouWantToDelete') }}
      </q-card-section>
      <q-card-actions align="center">
        <q-btn rounded push @click="showDeleteDialog = false" label="No" />
        <q-btn rounded push @click="deleteMusic" color="negative" label="Yes" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { formatYouTubeDuration, getCurrentMusicStructured, formatNumber } from 'src/utils/functions'
import { useMusicReproductor } from 'src/stores/MusicReproductor'
import { useMusicStore } from 'src/stores/Music'

const props = defineProps({
  music: Object,
  showPlayTimes: Boolean,
  showOptions: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['delete', 'play'])

const showDeleteDialog = ref(false)

const musicReproductorStore = useMusicReproductor()
const musicStore = useMusicStore()
const deleteMusic = () => {
  musicStore.remove(props.music.uuid)
  showDeleteDialog.value = false
  emit('delete', props.music.uuid)
}

const playAudio = () => {
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
</script>
