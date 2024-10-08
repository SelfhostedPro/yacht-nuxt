<template>
  <v-container class="d-flex flex-row pa-0">
    <v-tabs v-model="tab" direction="vertical" color="primary">
      <v-tab value="general">General</v-tab>
      <v-tab value="docker">Docker</v-tab>
      <v-tab value="variables">Variables</v-tab>
    </v-tabs>
    <v-tabs-window v-model="tab" class="w-100 pa-0">
      <v-tabs-window-item value="general">
          <settings-general />
      </v-tabs-window-item>
      <v-tabs-window-item value="docker">
        <v-container fluid>
          <settings-docker />
        </v-container>
      </v-tabs-window-item>
      <v-tabs-window-item value="variables">
        <v-container fluid>
          <settings-variables />
        </v-container>
      </v-tabs-window-item>
    </v-tabs-window>
  </v-container>
</template>

<script lang="ts" setup>
const tab = ref("general")
</script>

<style></style>
