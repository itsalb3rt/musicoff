<template>
  <q-card @click="$emit('details')" flat>
    <q-card-section class="text-center">
      <div>
        <q-avatar size="50px" color="white" text-color="black">
          {{ getTheFirstLetter(artist) }}
        </q-avatar>
      </div>
      <div class="q-mt-sm ellipsis-2-lines">
        {{ artist }}
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
defineProps({
  artist: {
    type: String,
    required: true,
  },
})

const getTheFirstLetter = (artist) => {
  return artist.charAt(0).toUpperCase()
}
</script>
