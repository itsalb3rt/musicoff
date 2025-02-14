<template>
  <q-card flat>
    <q-card-section>
      <div class="row q-col-gutter-sm items-center justify-center">
        <div class="col12">
          <q-avatar @click="$emit('details')" size="100px" color="white" text-color="black">
            {{ getTheFirstLetter(playlist.name) }}
          </q-avatar>
          <q-btn dense style="position: absolute" icon="more_vert" flat round>
            <q-menu class="no-shadow">
              <q-list style="min-width: 100px">
                <q-item @click="() => (showDeleteDialog = true)" clickable v-close-popup>
                  <q-item-section>{{ $t('action.delete') }}</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
        <div @click="$emit('details')" class="col-12 text-center">
          <div>
            {{ playlist.name }}
          </div>
          <div class="text-caption">
            {{ formatNumber(playlist.musics.length) }} {{ $t('common.music') }}
          </div>
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
const props = defineProps({
  playlist: Object,
})

const emit = defineEmits(['delete', 'details'])

emit('delete', props.playlist.uuid)

const showDeleteDialog = ref(false)

const getTheFirstLetter = (name) => {
  return name.charAt(0).toUpperCase()
}

const deletePlaylist = () => {
  showDeleteDialog.value = false
  emit('delete', props.playlist)
}
</script>
