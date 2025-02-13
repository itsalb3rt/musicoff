<template>
  <q-page padding>
    <div v-show="tab === 'main'">
      <div class="row q-col-gutter-md">
        <div class="col-12">
          <p class="text-h3 q-my-lg text-center">
            {{ $t('common.home') }}
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
          <music-card :show-options="false" :show-play-times="true" :music="music" />
        </div>
        <!-- To avoid hide the last track -->
        <div style="height: 100px" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useMusicStore } from 'src/stores/Music'
import MusicCard from 'components/music/MusicCard.vue'

const tab = ref('main')
const top10 = ref([])
const musicStore = useMusicStore()
const showPlayTimesTooltip = ref(false)

// watch tab changes
watch(tab, () => {
  if (tab.value === 'top10') {
    top10.value = musicStore.getTop10
  }
})
</script>
