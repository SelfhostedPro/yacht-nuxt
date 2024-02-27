<template>
  <v-card class="pb-2">
    <v-card-title><v-btn @click="reveal = !reveal" variant="plain" icon><v-icon
          :icon="reveal ? 'mdi-chevron-up' : 'mdi-chevron-down'" /></v-btn>{{ resource.Name }}</v-card-title>
    <v-expand-transition>
      <v-card-text class="overflow-auto" v-show="reveal">
        <pre>{{ resource }}</pre>
      </v-card-text>
    </v-expand-transition>
    <v-card-subtitle v-if="resource.CreatedAt">created: {{ formatDates(resource.CreatedAt) }}</v-card-subtitle>
    <v-card-subtitle>driver: {{ resource.Driver }}</v-card-subtitle>
    <v-card-subtitle>mount: {{ resource.Mountpoint }}</v-card-subtitle>
    <v-card-subtitle v-if="resource.Options">options: {{ resource.Options }}</v-card-subtitle>
    <v-card-subtitle v-if="resource.Scope">scope: {{ resource.Scope }}</v-card-subtitle>
    <v-card-subtitle v-if="resource.Status">status: {{ resource.Status }}</v-card-subtitle>
  </v-card>
</template>

<script lang="ts" setup>
import { parseISO } from 'date-fns';
import type { FixedVolumeInspectInfo } from '~/types/containers/fixedDockerode';



const reveal = ref(false)

const formatDates = (date: string) => {
  return parseISO(date).toLocaleString()
}

interface Props {
  server: string,
  resource: FixedVolumeInspectInfo
}
defineProps<Props>()
</script>

<style></style>~/shared/containers/fixedDockerode