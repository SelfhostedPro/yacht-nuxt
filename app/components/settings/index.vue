<template>
  <SettingsLayout>
    <template #toolbar>
      <v-toolbar color="primary" title="Settings" class="text-capitalize">
        <template #append>
          <v-btn icon="mdi-close" @click="$emit('close')" />
        </template>
      </v-toolbar>
    </template>
    <template #sidebar>
      <v-tabs v-model="tab" direction="vertical" class="pa-0" color="primary">
        <v-tab value="general">General</v-tab>
        <v-tab value="servers">Servers</v-tab>
      </v-tabs>
    </template>
    <template #content>
      <v-container v-if="!settings" class="pa-4">
        <v-skeleton-loader type="article" />
      </v-container>
      <v-tabs-window v-if="settings" direction="vertical" v-model="tab">
        <v-tabs-window-item value="general">
          <v-container class="pa-4">
            <settings-general :settings="settings" />
            <settings-theme />
          </v-container>
        </v-tabs-window-item>
        <v-tabs-window-item value="servers">
          <v-container class="pa-4">
            <settings-servers />
          </v-container>
        </v-tabs-window-item>
      </v-tabs-window>
    </template>
  </SettingsLayout>
</template>

<script lang="ts" setup>
const settingsStore = useSettingsStore()
const { settings } = storeToRefs(settingsStore)
const emits = defineEmits(['close'])

await settingsStore.fetchSettings()

const tab = ref("general")
const { values } = useForm({
  validationSchema: toTypedSchema(YachtConfigSchema),
  keepValuesOnUnmount: true,
  initialValues: { ...settings.value }
})
</script>