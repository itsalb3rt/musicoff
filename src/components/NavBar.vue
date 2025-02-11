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
      active-color="primary"
      indicator-color="transparent"
    >
      <q-tab @click="changeTab" class="q-py-md" name="home" icon="home"> </q-tab>
      <q-tab @click="changeTab" class="q-py-md" name="search" icon="search"> </q-tab>
      <q-tab @click="changeTab" class="q-py-md" name="music" icon="music_note"> </q-tab>
      <q-tab @click="changeTab" class="q-py-md" name="settings" icon="settings"> </q-tab>
    </q-tabs>
  </q-footer>
</template>

<script setup>
import { ref } from 'vue'
const emit = defineEmits(['changeTab'])

const tab = ref('home')

const changeTab = () => {
  emit('changeTab', tab.value)
}
</script>
