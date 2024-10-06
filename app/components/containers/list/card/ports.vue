<template>
  <v-card-item class="d-flex flex-column items-center">
    <v-card-subtitle class="mx-auto text-center">
      PORTS
    </v-card-subtitle>
    <v-item-group
      justify="start"
      show-arrows
    >
      <v-row no-gutters>
        <v-item
          v-for="port in disableIpv6(ports)"
          :key="port.containerPort"
        >
          <v-col v-if="labels && labels[`sh.yacht.${port.containerPort}`]">
            <v-tooltip
              location="bottom"
              :text="port.hostPort ? `${port.hostPort} => ${port.containerPort}` : `${port.containerPort} not forwarded`"
            >
              <template #activator="{ props }">
                <v-chip
                  v-bind="props"
                  label
                  size="small"
                  class="ma-1"
                  :color="port.hostPort ? 'primary' : 'error'"
                >
                  {{ labels[`sh.yacht.${port.containerPort}`] }}
                </v-chip>
              </template>
            </v-tooltip>
          </v-col>
          <v-col v-else>
            <v-tooltip
              location="bottom"
              :text="port.hostPort ? `host port: ${port.hostPort}` : 'port not forwarded'"
            >
              <template #activator="{ props }">
                <v-chip
                  v-bind="props"
                  label
                  size="small"
                  class="ma-1"
                  :color="port.hostPort ? 'primary' : 'error'"
                >
                  {{ port.containerPort }}
                </v-chip>
              </template>
            </v-tooltip>
          </v-col>
        </v-item>
      </v-row>
    </v-item-group>
  </v-card-item>
</template>

<script lang="ts" setup>
import type { ContainerPort, Container } from '~/types/containers/yachtContainers';
defineProps<{ ports: ContainerPort[], labels: Container['labels'] }>()

const disableIpv6 = (ports: ContainerPort[]) => {
    return ports.filter((port) => port.hostIP !== '::')
}
</script>