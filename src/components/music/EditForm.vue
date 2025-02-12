<template>
  <q-form @submit="onSubmit" class="q-gutter-md">
    <p class="text-h5">
      {{ $t('common.music') }}
    </p>
    <q-input
      type="textarea"
      rounded
      outlined
      v-model="music.title"
      :label="$t('common.title')"
      lazy-rules
      :rules="[(val) => (val && val.length > 0) || 'Please type something']"
    />
    <q-input rounded outlined v-model="music.artist" :label="$t('common.artist')" />
    <q-input rounded outlined v-model="music.album" :label="$t('common.album')" />
    <div class="text-center">
      <q-btn rounded :label="$t('action.save')" type="submit" color="primary" />
    </div>
  </q-form>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  music: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['submit'])

const music = ref(props.music)

const onSubmit = () => {
  emit('submit', music.value)
}
</script>
