<template>
  <q-page padding>
    <p class="text-h5">
      {{ $t('common.settings') }}
    </p>
    <div class="row q-col-gutter-md">
      <div class="col-12 q-mb-lg">
        <q-input
          :hint="$t('messages.serverInformation')"
          rounded
          outlined
          v-model="server"
          :label="$t('common.server')"
        />
      </div>
      <div class="col-12 text-center">
        <q-btn color="primary" rounded :label="$t('action.save')" @click="handleSave" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useSettingsStore } from 'src/stores/Settings'

const $q = useQuasar()
const $t = useI18n().t
const settingsStore = useSettingsStore()
const server = ref(settingsStore.server)

const handleSave = () => {
  settingsStore.server = server.value

  $q.notify({
    message: $t('common.settingsSaved'),
    color: 'positive',
    position: 'bottom',
  })
}
</script>
