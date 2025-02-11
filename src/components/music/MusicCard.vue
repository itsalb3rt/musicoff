<template>
  <q-card flat bordered class="q-my-md">
    <q-card-section>
      <div class="row q-col-gutter-md">
        <div class="col-3">
          <q-img :src="music.thumbnail" alt="thumbnail" />
        </div>
        <div class="col-9">
          <div>{{ music.title }}</div>
          <div caption>{{ music.duration }}</div>
          <div caption>{{ formatYouTubeDuration(music.duration) }}</div>
        </div>
        <div class="col-12">
          <q-btn @click="() => playAudio()" rounded outline class="q-mr-sm" icon="play_arrow" />
          <q-btn class="float-right" color="dark" icon="more_vert" flat round>
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
import { formatYouTubeDuration } from 'src/utils/functions'
import { useMusicReproductor } from 'src/stores/MusicReproductor'
import { useMusicStore } from 'src/stores/Music'

const props = defineProps({
  music: Object,
})

const showDeleteDialog = ref(false)

const musicReproductorStore = useMusicReproductor()
const musicStore = useMusicStore()

const deleteMusic = () => {
  musicStore.remove(props.music.uuidName)
  showDeleteDialog.value = false
}

const playAudio = () => {
  // reproduce the audio using the videoId
  musicReproductorStore.setVideoId(props.music.uuidName)
  musicReproductorStore.current = {
    id: {
      videoId: props.music.uuidName,
    },
    snippet: {
      title: props.music.title,
      thumbnails: {
        default: {
          url: props.music.thumbnail,
        },
      },
    },
    contentDetails: {
      duration: props.music.duration,
    },
  }
  musicReproductorStore.setShowPlayer(true)
}

// uuidName
// title: video.snippet.title,
//         duration
// thumbnail
// createdAt
</script>
