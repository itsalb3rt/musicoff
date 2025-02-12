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
      <div class="col-12">
        <q-btn
          :loading="restoringBackup"
          @click="showRestoreBackupDialog = true"
          icon="cloud_upload"
          rounded
          color="white"
          text-color="black"
          :label="$t('action.openRestoreMusicBackupFile')"
        />
        <q-dialog full-width v-model="showRestoreBackupDialog">
          <q-card>
            <q-card-section>
              <p class="text-h6">
                {{ $t('common.restoreMusicBackupFile') }}
              </p>
              <q-input
                type="textarea"
                v-model="restoreBackupText"
                :label="$t('common.pasteTheBackupFileHere')"
                outlined
                rounded
              />
            </q-card-section>
            <q-card-actions align="right">
              <q-btn
                :loading="restoringBackup"
                rounded
                color="primary"
                :label="$t('action.restore')"
                @click="restoreMusicBackupFile"
              />
              <q-btn
                :disable="restoringBackup"
                rounded
                :label="$t('action.cancel')"
                @click="showRestoreBackupDialog = false"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
      <div class="col-12">
        <q-separator />
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
const restoringBackup = ref(false)
const showRestoreBackupDialog = ref(false)
const restoreBackupText = ref('')

const restoreMusicBackupFile = async () => {
  restoringBackup.value = true

  try {
    restoringBackup.value = true
    const data = JSON.parse(restoreBackupText.value)

    if (!Array.isArray(data)) {
      throw new Error('Invalid data')
    }

    if (data.length === 0) {
      throw new Error('Empty data')
    }

    musicStore.setDownloaded(data)

    $q.notify({
      message: $t('messages.musicBackupFileRestored'),
      color: 'positive',
      position: 'bottom',
    })

    setTimeout(() => {
      window.location.reload()
    }, 1000)
  } catch (error) {
    console.error(error)
    $q.notify({
      message: $t('error.musicBackupFileRestoreError'),
      color: 'negative',
      position: 'bottom',
    })
  } finally {
    restoringBackup.value = false
    showRestoreBackupDialog.value = false
  }

  restoringBackup.value = false
  showRestoreBackupDialog.value = false
}

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
