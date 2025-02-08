<template>
  <q-footer
    style="max-width: 900px"
    :class="`main-footer ${
      $q.dark.isActive ? 'bg-dark text-white' : 'bg-white text-black'
    } q-mx-auto`"
    :bordered="$q.dark.isActive ? false : true"
  >
    <q-tabs
      class="bottom-navigation constrain"
      v-model="tab"
      align="justify"
      :mobile-arrows="false"
      active-color="accent"
      indicator-color="transparent"
    >
      <q-route-tab class="q-py-md" name="dashboard" to="/" icon="home">
        {{ $t('common.home') }}
      </q-route-tab>
      <q-route-tab class="q-py-md" name="goals" to="/search" icon="search">
        {{ $t('common.search') }}
      </q-route-tab>
      <q-route-tab class="q-py-md" name="nutrition" to="/music" icon="music_note">
        {{ $t('common.music') }}
      </q-route-tab>
      <q-route-tab class="q-py-md" name="community" to="/settings" icon="settings">
        {{ $t('common.settings') }}
      </q-route-tab>
    </q-tabs>
  </q-footer>
</template>

<script setup>
import { ref } from 'vue'

const tab = ref('home')
</script>
