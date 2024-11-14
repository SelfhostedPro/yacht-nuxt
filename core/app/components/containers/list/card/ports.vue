<template>
  <div class="flex flex-col items-center">
    <h2 class="mx-auto text-center">PORTS</h2>
    <div class="flex overflow-x-auto">
      <div class="flex flex-wrap justify-start">
        <div
          v-for="port in disableIpv6(ports)"
          :key="port.containerPort"
          class="p-2"
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <span
                  v-if="labels && labels[`sh.yacht.${port.containerPort}`]"
                  class="inline-block px-3 py-1 text-sm font-medium rounded-full"
                  :class="port.hostPort ? 'bg-blue-500 text-white' : 'bg-red-500 text-white'"
                >
                  {{ labels[`sh.yacht.${port.containerPort}`] }}
                </span>
                <span
                  v-else
                  class="inline-block px-3 py-1 text-sm font-medium rounded-full"
                  :class="port.hostPort ? 'bg-blue-500 text-white' : 'bg-red-500 text-white'"
                >
                  {{ port.containerPort }}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                {{ port.hostPort ? `host port: ${port.hostPort}` : 'port not forwarded' }}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ContainerPort, Container } from '#docker/types/containers/yachtContainers';
defineProps<{ ports: ContainerPort[], labels: Container['labels'] }>()

const disableIpv6 = (ports: ContainerPort[]) => {
    return ports.filter((port) => port.hostIP !== '::')
}
</script>
