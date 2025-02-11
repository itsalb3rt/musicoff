<template>
  <q-page padding>
    <p class="text-h5">
      {{ $t('common.settings') }}
    </p>
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-input rounded outlined v-model="server" :label="$t('common.server')" />
        <p class="text-caption text-grey">
          {{ $t('messages.serverInformation') }}
        </p>
      </div>
      <div class="col-12">
        <q-separator />
      </div>
      <div class="col-12">
        <q-btn
          disable
          :loading="creatingBackup"
          @click="downloadMusicBackupFile"
          icon="cloud_download"
          rounded
          color="white"
          text-color="black"
          :label="$t('action.downloadMusicBackupFile')"
        />
        <p class="text-caption text-grey">
          {{ $t('messages.downloadMusicBackupFileInformation') }}
        </p>
      </div>
      <div class="col-12 text-center">
        <q-btn icon="save" color="primary" rounded :label="$t('action.save')" @click="handleSave" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useI18n } from 'vue-i18n'
import { useSettingsStore } from 'src/stores/Settings'
import { useMusicStore } from 'src/stores/Music'

const $q = useQuasar()
const $t = useI18n().t
const settingsStore = useSettingsStore()
const musicStore = useMusicStore()
const server = ref(settingsStore.server)
const creatingBackup = ref(false)

const downloadMusicBackupFile = () => {
  creatingBackup.value = true

  const data = musicStore.music
  const filename = `music-backup-${new Date().toISOString().split('T')[0]}.json`
  // Convert array to JSON string
  const jsonString = JSON.stringify(data, null, 2)

  // Create a Blob with JSON content
  const blob = new Blob([jsonString], { type: 'application/json' })

  // Check for Safari compatibility
  if (window.navigator.msSaveBlob) {
    // For IE & Edge
    window.navigator.msSaveBlob(blob, filename)
  } else {
    // Create a temporary anchor element
    const a = document.createElement('a')
    const url = URL.createObjectURL(blob)

    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()

    // Cleanup: revoke the object URL
    setTimeout(() => {
      URL.revokeObjectURL(url)
      document.body.removeChild(a)
    }, 100)
  }

  setTimeout(() => {
    creatingBackup.value = false
  }, 1000)
}

const handleSave = () => {
  settingsStore.server = server.value

  $q.notify({
    message: $t('common.settingsSaved'),
    color: 'positive',
    position: 'bottom',
  })
}
</script>
