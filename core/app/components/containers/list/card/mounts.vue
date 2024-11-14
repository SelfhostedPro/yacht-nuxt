<template>
  <div class="flex flex-col items-center">
    <h2 class="mx-auto text-center">MOUNTS</h2>
    <div class="mx-auto flex overflow-x-auto">
      <div class="flex flex-wrap">
        <div
          v-for="mount in mounts"
          :key="mount.destination"
          class="p-2"
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <span
                  class="inline-block px-3 py-1 text-sm font-medium rounded-full"
                  :class="mount.source ? 'bg-blue-500 text-white' : 'bg-red-500 text-white'"
                >
                  {{ mount.destination }}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                {{ mount.source ? `host: ${mount.source}` : 'not mounted' }}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ContainerMount } from '#docker/types/containers/yachtContainers';
defineProps<{ mounts: ContainerMount[] }>()
</script>
