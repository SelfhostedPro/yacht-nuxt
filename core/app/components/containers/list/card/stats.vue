<template>
  <div class="relative">
    <Tooltip>
      <template #content>
        <div class="text-sm text-gray-700">
          {{ stats.memoryPercentage ? `memory: ${stats.memoryPercentage}%` : 'N/A' }}
          <br>
          {{ stats.cpuUsage ? `cpu: ${stats.cpuUsage}%` : 'N/A' }}
        </div>
      </template>
      <div class="flex items-center justify-center">
        <Progress
          :model-value="Number(stats.memoryPercentage) || 0"
          class="w-16 h-16 text-blue-500"
        >
          <Progress
            :model-value="Number(stats.cpuUsage) || 0"
            class="w-12 h-12 text-yellow-500"
          >
            <slot name="default" />
          </Progress>
        </Progress>
      </div>
    </Tooltip>
  </div>
</template>

<script lang="ts" setup>
import { Tooltip } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import type { ContainerStat } from "#docker/types/containers/yachtContainers";

interface Props {
  stats: ContainerStat;
}
defineProps<Props>();
</script>

<style scoped>
/* You can add additional styles here if needed */
</style>
