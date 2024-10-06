<template>
  <v-card color="foreground" class="overflow-auto" id="networks-card">
    <v-card-title>{{ resource.Name.toLowerCase() }} <v-btn @click="reveal = !reveal" variant="plain" icon><v-icon
          :icon="reveal ? 'mdi-chevron-up' : 'mdi-chevron-down'" /></v-btn></v-card-title>
    <v-expand-transition>
      <v-card-text v-show="reveal">
        <pre>{{ resource }}</pre>
      </v-card-text>
    </v-expand-transition>
    <v-card-subtitle>id: {{ resource.Id.slice(0, 12) }}</v-card-subtitle>
    <v-card-subtitle>created: {{ formatDates(resource.Created) }}</v-card-subtitle>
    <v-list>
      <v-row>
        <v-col>
          <v-list-item>
            <v-list-item-title>driver</v-list-item-title>
            <v-list-item-subtitle>{{ resource.Driver }}</v-list-item-subtitle>
          </v-list-item>
        </v-col>
        <v-col>
          <v-list-item>
            <v-list-item-title>ipv6</v-list-item-title>
            <v-list-item-subtitle>{{ resource.EnableIPv6 }}</v-list-item-subtitle>
          </v-list-item>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-list-item v-if="resource.IPAM?.Config && resource.IPAM.Config[0] && resource.IPAM?.Config[0]['Subnet']">
            <v-list-item-title>subnet</v-list-item-title>
            <v-list-item-subtitle>{{ resource.IPAM.Config[0]['Subnet'] }}</v-list-item-subtitle>
          </v-list-item>
        </v-col>
        <v-col>
          <v-list-item v-if="resource.IPAM?.Config && resource.IPAM.Config[0] && resource.IPAM?.Config[0]['Gateway']">
            <v-list-item-title>gateway</v-list-item-title>
            <v-list-item-subtitle>{{ resource.IPAM.Config[0]['Gateway'] }}</v-list-item-subtitle>
          </v-list-item>
        </v-col>
      </v-row>
    </v-list>
  </v-card>
</template>

<script lang="ts" setup>
import type { NetworkInspectInfo } from 'dockerode';
import { parseISO } from 'date-fns';
const reveal = ref(false)

const formatDates = (date: string) => {
  return parseISO(date).toLocaleString()
}
interface Props {
  server: string,
  resource: NetworkInspectInfo
}
defineProps<Props>()
</script>

<style></style>