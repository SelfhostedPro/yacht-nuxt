<template>
  <v-card>
    <v-tabs v-model="tab" color="primary" bg-color="foreground" grow>
      <v-tab rounded="0" value="0">mounts</v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item value="0">
        <v-list v-if="container.mounts && container.mounts[0]">
          <v-list-item v-for="mount in container.mounts" :key="mount.destination" class="text-no-wrap">
            <v-list-item-title>{{ mount.destination }}</v-list-item-title>
            <v-list-item-subtitle>{{ `type: ${mount['type']}` }}</v-list-item-subtitle>
            <v-list-item-subtitle v-if="mount.name">{{ `name: ${mount.name}` }}</v-list-item-subtitle>
            <v-list-item-subtitle v-if="mount['driver']">{{ `driver: ${mount['driver']}`
            }}</v-list-item-subtitle>
            <v-list-item-subtitle>{{ `read-only: ${!mount['rw']}` }}</v-list-item-subtitle>
            {{ `source: ${mount.source}` }}
          </v-list-item>
        </v-list>
        <v-card-text v-else>No mounts configured.</v-card-text>
      </v-window-item>
    </v-window>
  </v-card>
</template>

<script lang="ts" setup>
import type { Container } from '~/types/containers/yachtContainers';

interface Props {
  container: Container
}
defineProps<Props>()
const tab = ref(0)

</script>

<style></style>~/shared/containers/yachtContainers