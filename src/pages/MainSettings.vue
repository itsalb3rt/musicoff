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
          :loading="creatingBackup"
          @click="downloadMusicBackupFile"
          icon="cloud_download"
          rounded
          color="white"
          text-color="black"
          :label="$t('action.copyTheBackupFileOnTheClipBoard')"
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
import { Clipboard } from 'app/src-capacitor/node_modules/@capacitor/clipboard'

const $q = useQuasar()
const $t = useI18n().t
const settingsStore = useSettingsStore()
const musicStore = useMusicStore()
const server = ref(settingsStore.server)
const creatingBackup = ref(false)

const downloadMusicBackupFile = async () => {
  creatingBackup.value = true

  const data = musicStore.downloaded.map((music) => {
    return {
      ...music,
      downloaded: false,
    }
  })

  await Clipboard.write({
    string: JSON.stringify(data),
  })

  setTimeout(() => {
    creatingBackup.value = false

    $q.notify({
      message: $t('messages.musicBackupFileCopiedToClipboard'),
      color: 'positive',
      position: 'bottom',
    })
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
