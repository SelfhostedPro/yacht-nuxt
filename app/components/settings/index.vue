<template>
  <v-container class="d-flex flex-row pa-0">
    <v-tabs v-model="tab" direction="vertical" color="primary">
      <v-tab value="general">General</v-tab>
      <v-tab value="servers">Servers</v-tab>
    </v-tabs>
    <v-container v-if="!settings" class="w-100 pa-0">
      <v-skeleton-loader type="article" />
    </v-container>
    <v-tabs-window v-else-if="settings" v-model="tab" class="w-100 pa-0">
      <v-tabs-window-item value="general">
        <v-sheet color="foreground" class="w-100 pa-0">
          <v-row>
            <settings-general :settings="settings!" />
            <settings-theme color="surface" />
          </v-row>
        </v-sheet>
      </v-tabs-window-item>
      <v-tabs-window-item value="servers">
        <v-sheet color="foreground" class="w-100 pa-0">
          <v-row>
            <settings-servers />
          </v-row>
        </v-sheet>
      </v-tabs-window-item>
    </v-tabs-window>
  </v-container>
</template>

<script lang="ts" setup>
const settingsStore = useSettingsStore()
const { settings } = storeToRefs(settingsStore)

await settingsStore.fetchSettings()

const tab = ref("general")
const { values } = useForm({ validationSchema: toTypedSchema(YachtConfigSchema), keepValuesOnUnmount: true, initialValues: { ...settings.value } })
console.log(`config:`, settings.value)
</script>

<style></style>
