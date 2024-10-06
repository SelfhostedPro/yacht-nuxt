<template>
  <v-card>
    <v-tabs v-model="tab" color="primary" bg-color="foreground" grow>
      <v-tab rounded="0" :value="0">ports</v-tab>
      <v-tab rounded="0" :value="1">networks</v-tab>
      <v-tab rounded="0" :value="2">advanced</v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item :value="0">
        <v-table>
          <thead>
            <tr>
              <th class="text-left">
                container port
              </th>
              <th class="text-center">
                host ip
              </th>
              <th class="text-right">
                host port
              </th>
            </tr>
          </thead>
          <tbody v-if="container.ports">
            <tr v-for="port of container.ports" :key="port.containerPort">
              <td class="text-left">{{ port.containerPort }}</td>
              <td v-if="port.hostIP" class="text-center">{{
                port.hostIP }}</td>
              <td v-else class="text-center">-</td>
              <td v-if="port.hostPort" class="text-right">
                <v-tooltip :text="port.hostPort.toString()">
                  <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" prepend-icon="mdi-link-variant" color="primary">{{
                      container.labels && container.labels[`sh.yacht.${port.hostPort}`] ||
                      port.hostPort }}</v-btn>
                  </template>
                </v-tooltip>
              </td>
              <td v-else class="text-right">-</td>
            </tr>
          </tbody>
          <v-card-text v-else> {{ container.name }}
            {{ container.status !== 'running' ? 'is not running' : 'has no portsforwarded' }} </v-card-text>
        </v-table>
      </v-window-item>
      <v-window-item :value="1">
        <v-list>
          <v-list-item v-for="network, name in container.config.network.networks" :key="name">
            <v-list-item-title>{{ name }}</v-list-item-title>
            <v-list-item-subtitle>ip address: {{ network.IPAddress + '/' + network.IPPrefixLen
            }}</v-list-item-subtitle>
            <v-list-item-subtitle>gateway: {{ network.Gateway + '/' + network.IPPrefixLen
            }}</v-list-item-subtitle>
            <v-list-item-subtitle>id: {{ network.NetworkID }}</v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-window-item>
      <v-window-item :value="2">
        <v-list>
          <v-list-item>
            <v-list-item-title>mode</v-list-item-title>
            <v-list-item-subtitle>{{ container.config.network.mode }}</v-list-item-subtitle>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>hostname</v-list-item-title>
            <v-list-item-subtitle>{{ container.config.general?.hostname }}</v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-window-item>
    </v-window>
  </v-card>
</template>
<script setup lang="ts">
import type { Container } from '~/types/containers/yachtContainers';

interface Props {
  container: Container
}
defineProps<Props>()
const tab = ref(0)
</script>~/shared/containers/yachtContainers