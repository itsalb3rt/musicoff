<template>
  <q-page padding>
    <div v-show="tab === 'main'">
      <div class="row q-col-gutter-md">
        <div class="col-12">
          <p class="text-h3 q-my-lg text-center">
            {{ $t('common.home') }}
          </p>
        </div>
        <div class="col-12">
          <p class="text-h6">
            {{ $t('common.tops') }}
          </p>
        </div>
        <div class="col-6">
          <q-card @click="tab = 'top10'" flat>
            <q-card-section>
              <div class="row items-center">
                <div class="col-4">
                  <img style="width: 40px" alt="Quasar logo" src="~assets/main.png" />
                </div>
                <div class="col">
                  {{ $t('common.myTop10') }}
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
        <!-- Artists -->
        <template v-if="musicStore.getAllArtists.length > 0">
          <div class="col-12">
            <p class="text-h6">
              {{ $t('common.artists') }}
            </p>
          </div>
          <div class="col-12">
            <q-scroll-area visible style="height: 150px; max-width: 100%">
              <div class="row no-wrap">
                <div
                  v-for="(artist, index) in musicStore.getAllArtists"
                  :key="index"
                  style="width: 150px"
                  class="q-pa-sm"
                >
                  <ArtistCard @details="handleShowArtistList(artist)" :artist="artist" />
                </div>
              </div>
            </q-scroll-area>
          </div>
        </template>
        <div class="col-12">
          <p class="text-h6">
            {{ $t('common.myPlaylists') }}
            <q-btn
              v-if="musicStore.playlists.length > 0"
              class="float-right"
              flat
              dense
              icon="add"
              @click="() => (showPlaylistCreationForm = true)"
              :label="$t('action.createPlayList')"
            />
          </p>

          <div class="col-12">
            <template v-if="musicStore.playlists.length === 0">
              <div class="text-center">
                <p class="text-center text-grey-8 q-my-md">
                  {{ $t('messages.youNoHavePlayListsCreated') }}
                </p>
                <q-btn
                  rounded
                  color="primary"
                  icon="add"
                  @click="() => (showPlaylistCreationForm = true)"
                  :label="$t('action.createPlayList')"
                />
              </div>
            </template>
            <div class="row q-col-gutter-sm">
              <div class="col-6" v-for="(playlist, index) in musicStore.playlists" :key="index">
                <play-list-card
                  @details="() => handleShowPlaylistDetails(playlist)"
                  @delete="() => musicStore.deletePlayList(playlist)"
                  :playlist="playlist"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Artists -->
    <div v-if="tab === 'artist'">
      <div class="row q-col-gutter-md items-center justify-center">
        <div class="col-12">
          <q-btn flat round dense icon="arrow_back" @click="tab = 'main'" />
        </div>
        <div class="col-12">
          <p class="text-center q-my-lg">{{ currentArtist }}</p>
          <div class="text-caption text-center text-grey-8">
            {{ musicStore.getAllMusicByArtist(currentArtist).length }} {{ $t('common.music') }}
          </div>
          <div
            class="q-my-sm"
            v-for="(music, index) in musicStore.getAllMusicByArtist(currentArtist)"
            :key="index"
          >
            <music-card
              :show-options="false"
              @play="musicStore.currentPlayList = musicStore.getAllMusicByArtist(currentArtist)"
              :music="music"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- Top 10 -->
    <div v-if="tab === 'top10'">
      <div class="row q-col-gutter-md items-center justify-center">
        <div class="col-2">
          <q-btn flat round dense icon="arrow_back" @click="tab = 'main'" />
        </div>
        <div class="col8">
          <p class="text-h3 text-center q-my-lg">
            {{ $t('common.myTop10') }}
          </p>
        </div>
        <div class="col-2">
          <q-btn
            @click="() => (showPlayTimesTooltip = !showPlayTimesTooltip)"
            flat
            round
            dense
            icon="info"
            class="float-right"
          >
            <q-tooltip :model-value="showPlayTimesTooltip">
              {{ $t('messages.playTimesDescription') }}
            </q-tooltip>
          </q-btn>
        </div>
      </div>
      <div class="col-12">
        <div class="q-my-sm" v-for="music in top10" :key="music.uuid">
          <music-card
            @play="handlePlayTop10"
            :show-options="false"
            :show-play-times="true"
            :music="music"
          >
            <template v-slot:extra-options>
              <div class="col-1">
                <q-btn dense class="float-right" icon="more_vert" flat round>
                  <q-menu class="dark-mode-shadow">
                    <q-list style="min-width: 200px">
                      <q-item
                        @click="() => handleShowResetPlayTimes(music)"
                        clickable
                        v-close-popup
                      >
                        <q-item-section avatar>
                          <q-icon name="refresh" />
                        </q-item-section>
                        <q-item-section>
                          {{ $t('action.resetPlayTimes') }}
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </div>
            </template>
          </music-card>
        </div>
        <!-- To avoid hide the last track -->
        <div style="height: 100px" />
      </div>
    </div>

    <q-dialog maximized v-model="showPlaylistCreationForm" persistent>
      <q-card flat>
        <q-card-section class="text-h6">
          <q-btn
            flat
            round
            dense
            icon="arrow_back"
            @click="() => (showPlaylistCreationForm = false)"
          />
          {{ $t('action.createPlayList') }}
        </q-card-section>
        <q-card-section>
          <play-list-creation-form @created="handleSubmitPlaylistCreation" />
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- Playlist details -->
    <q-dialog maximized persistent v-model="showPlaylistDetails">
      <q-card flat>
        <q-card-section class="row justify-between items-center q-pa-md">
          <q-btn flat round dense icon="arrow_back" @click="() => (showPlaylistDetails = false)" />
          <q-space />
          <q-btn @click="() => (showPlaylistEditionForm = true)" flat round dense icon="edit" />
        </q-card-section>
        <q-card-section>
          <play-list-details :playlist="selectedPlaylist" />
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- Playlist edition -->
    <q-dialog maximized persistent v-model="showPlaylistEditionForm">
      <q-card flat>
        <q-card-section class="row justify-between items-center q-pa-md">
          <q-btn
            flat
            round
            dense
            icon="arrow_back"
            @click="() => (showPlaylistEditionForm = false)"
          />
          <q-space />
          <q-btn flat round dense icon="edit" />
        </q-card-section>
        <q-card-section>
          <play-list-edition-form
            @edited="() => (showPlaylistEditionForm = false)"
            :playlist="selectedPlaylist"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- Reset play times -->
    <q-dialog v-model="showResetPlayTimes">
      <q-card flat>
        <q-card-section class="text-h6">
          {{ $t('action.resetPlayTimes') }}
        </q-card-section>
        <q-card-section>
          <q-card-section>
            {{ $t('messages.resetPlayTimesConfirmation', { music: musicToResetPlayTimes.title }) }}
            <div class="text-center">
              <div class="text-bold">
                {{ musicToResetPlayTimes.title }}
              </div>
              {{
                musicToResetPlayTimes.playTimes
                  ? $t('common.playTimes') + ': ' + formatNumber(musicToResetPlayTimes.playTimes)
                  : 0
              }}
            </div>
          </q-card-section>
          <q-card-section class="text-center">
            <q-btn
              rounded
              push
              @click="() => (showResetPlayTimes = false)"
              :label="$t('action.cancel')"
            />
            <q-btn
              v-close-popup
              color="negative"
              :label="$t('action.reset')"
              @click="() => handleResetPlayTimes()"
            />
          </q-card-section>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useMusicStore } from 'src/stores/Music'
import MusicCard from 'components/music/MusicCard.vue'
import PlayListCard from 'components/playlist/PlayListCard.vue'
import PlayListCreationForm from 'components/playlist/PlayListCreationForm.vue'
import PlayListDetails from 'components/playlist/PlayListDetails.vue'
import PlayListEditionForm from 'components/playlist/PlayListEditionForm.vue'
import { formatNumber } from 'src/utils/functions'
import ArtistCard from 'components/artists/ArtistCard.vue'

const tab = ref('main')
const top10 = ref([])
const musicStore = useMusicStore()
const showPlayTimesTooltip = ref(false)
const showPlaylistCreationForm = ref(false)
const showPlaylistDetails = ref(false)
const selectedPlaylist = ref({})
const showPlaylistEditionForm = ref(false)
const showResetPlayTimes = ref(false)
const musicToResetPlayTimes = ref({})
const currentArtist = ref('')

// watch tab changes
watch(tab, () => {
  if (tab.value === 'top10') {
    top10.value = musicStore.getTop10
  }
})

const handlePlayTop10 = () => {
  musicStore.currentPlayList = musicStore.getTop10
}

const handleSubmitPlaylistCreation = () => {
  showPlaylistCreationForm.value = false
}

const handleShowPlaylistDetails = (playlist) => {
  selectedPlaylist.value = playlist
  showPlaylistDetails.value = true
}

const handleShowResetPlayTimes = (music) => {
  musicToResetPlayTimes.value = music
  showResetPlayTimes.value = true
}

const handleResetPlayTimes = () => {
  musicStore.resetPlayTimes(musicToResetPlayTimes.value)
  showResetPlayTimes.value = false
  top10.value = musicStore.getTop10
}

const handleShowArtistList = (artist) => {
  tab.value = 'artist'
  currentArtist.value = artist
}
</script>
