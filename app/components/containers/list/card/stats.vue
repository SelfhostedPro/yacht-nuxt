<template>
  <div>
    <v-tooltip location="bottom">
      <template #default>
        {{
          stats.memoryPercentage
            ? `memory: ${stats.memoryPercentage}%`
            : undefined
        }}
        <br />
        {{ stats.cpuUsage ? `cpu: ${stats.cpuUsage}%` : undefined }}
      </template>
      <template #activator="{ props }">
        <v-progress-circular
          v-bind="props"
          :indeterminate="loading.includes('containers')"
          :model-value="stats.memoryPercentage || 0"
          :size="60"
          color="blue"
        >
          <v-progress-circular
            v-bind="props"
            :indeterminate="loading.includes('containers')"
            :model-value="stats.cpuUsage || 0"
            :size="50"
            color="yellow"
          >
            <template #default>
              <slot name="default" />
            </template>
          </v-progress-circular>
        </v-progress-circular>
      </template>
    </v-tooltip>
  </div>
</template>

<script lang="ts" setup>
import type { ContainerStat } from "~/types/containers/yachtContainers";
const { loading } = useContainersStore();
interface Props {
  stats: ContainerStat;
}
defineProps<Props>();
</script>

<style></style>
