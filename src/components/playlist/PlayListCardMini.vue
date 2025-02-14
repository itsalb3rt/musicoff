<template>
  <q-card bordered flat>
    <q-card-section>
      <div class="row q-col-gutter-sm items-center">
        <div class="col-2">
          <q-avatar @click="$emit('details')" size="50px" color="white" text-color="black">
            {{ getTheFirstLetter(playlist.name) }}
          </q-avatar>
        </div>
        <div @click="$emit('details')" class="col-9">
          <div>
            {{ playlist.name }}
          </div>
          <div class="text-caption">
            {{ formatNumber(playlist.musics.length) }} {{ $t('common.music') }}
          </div>
        </div>
        <div class="col-1">
          <q-btn
            :color="isOnThePlaylist(music) ? 'green' : 'primary'"
            rounded
            dense
            class="float-right"
            :icon="isOnThePlaylist(music) ? 'playlist_add_check' : 'playlist_add'"
            @click="
              () => (isOnThePlaylist(music) ? handleRemoveMusic(music) : handleAddMusic(music))
            "
          />
        </div>
      </div>
    </q-card-section>

    <q-dialog v-model="showDeleteDialog">
      <q-card>
        <q-card-section>
          {{ $t('messages.areYouSureYouWantToDeleteThePlaylist') }}
        </q-card-section>
        <q-card-actions align="center">
          <q-btn rounded push @click="showDeleteDialog = false" label="No" />
          <q-btn rounded push @click="deletePlaylist" color="negative" label="Yes" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script setup>
import { ref } from 'vue'
import { formatNumber } from 'src/utils/functions'
import { useMusicStore } from 'src/stores/Music'

const props = defineProps({
  playlist: Object,
  music: Object,
})

const showDeleteDialog = ref(false)
const musicStore = useMusicStore()

const isOnThePlaylist = (music) => {
  return props.playlist.musics.some((m) => m.uuid === music.uuid)
}

const getTheFirstLetter = (name) => {
  return name.charAt(0).toUpperCase()
}

const handleAddMusic = () => {
  musicStore.addMusicToPlaylist({ musicUuid: props.music.uuid, playlistUuid: props.playlist.uuid })
}

const handleRemoveMusic = () => {
  musicStore.removeMusicFromPlaylist({
    musicUuid: props.music.uuid,
    playlistUuid: props.playlist.uuid,
  })
}
</script>
