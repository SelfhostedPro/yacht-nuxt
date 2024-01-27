<template>
  <div
    style="position: absolute; top: 0; right: 0;"
    class="d-flex flex-column justify-space-around fill-height mr-4"
  >
    <!-- <div v-if="loading.includes('stats')">
      <v-progress-circular indeterminate :size="40" color="primary"><v-icon icon="mdi-memory" /></v-progress-circular>
      <v-progress-circular indeterminate :size="40" color="blue"><v-icon icon="mdi-chip" /></v-progress-circular>
    </div> -->
    <v-tooltip location="bottom">
      <template #default>
        {{ stats.memoryPercentage ? `memory: ${stats.memoryPercentage}%` : undefined }} <br>
        {{ stats.memoryPercentage ? `cpu: ${stats.cpuUsage}%` : undefined }}
      </template>
      <template #activator="{ props }">
        <v-progress-circular
          v-bind="props"
          :indeterminate="loading.includes('stats')"
          :model-value="stats.memoryPercentage || 0"
          :size="40"
          color="primary"
        >
          <v-icon icon="mdi-memory" />
        </v-progress-circular>
        <v-progress-circular
          v-bind="props"
          :indeterminate="loading.includes('stats')"
          :model-value="stats.cpuUsage || 0"
          :size="40"
          color="blue"
        >
          <v-icon icon="mdi-chip" />
        </v-progress-circular>
      </template>
    </v-tooltip>
  </div>
</template>

<script lang="ts" setup>
import type { ContainerStat } from '~/types/containers/yachtContainers';
const { loading } = useContainersStore()
interface Props {
  stats: ContainerStat;
}
defineProps<Props>();
</script>

<style></style>