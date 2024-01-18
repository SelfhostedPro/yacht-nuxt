<template>
  <!-- <v-card class="pa-2 justify-start" density="compact" style="transition: height 0.3s ease-in-out;"
    :loading="loading ? 'primary' : false">
    <v-row dense no-gutters class="align-start">
      <v-col>
        <containers-card-base :container="container" />
        <v-row class="align-center justify-start">
          <v-col>
            Expansion Buttons
            <v-btn rounded="0" :active="reveal.includes(actions)"
              :icon="reveal.includes(actions) ? 'mdi-chevron-up' : 'mdi-chevron-down'" variant="text" color="primary"
              v-on:click.prevent="handleRevealButton(actions)" />
            <v-btn rounded="0" :active="reveal.includes(mounts)" v-if="container.mounts && container.mounts[0]"
              :icon="reveal.includes(mounts) ? 'mdi-file-tree' : 'mdi-file-tree-outline'" variant="text" color="primary"
              v-on:click.prevent="handleRevealButton(mounts)" />
            <v-btn rounded="0" :active="reveal.includes(ports)" v-if="container.ports && container.ports[0]"
              :icon="reveal.includes(ports) ? 'mdi-lan-pending' : 'mdi-lan-connect'" variant="text" color="primary"
              v-on:click.prevent="handleRevealButton(ports)" />
            <v-btn rounded="0" :active="reveal.includes(raw)"
              :icon="reveal.includes(raw) ? 'mdi-code-braces-box' : 'mdi-code-braces'" variant="text" color="primary"
              v-on:click.prevent="handleRevealButton(raw)" />
          </v-col>
        </v-row>
        Expansion Ref
        <ul v-auto-animate>
          Dynamic Components
          <component v-for="revealItem, i in reveal" :key="i" :is="revealItem" @start-loading="loading = true"
            @stop-loading="loading = false"
            v-bind:mounts="container.mounts && container.mounts[0] ? container.mounts : []"
            v-bind:ports="container.ports && container.ports[0] ? container.ports : []" v-bind:labels="container.labels"
            v-bind:container="reveal.includes(raw) || reveal.includes(actions) ? container : null"
            v-bind:server="reveal.includes(actions) ? server : null" />
        </ul>
      </v-col>
    </v-row>
  </v-card> -->
</template>

<script lang="ts" setup>
import { LazyContainersCardMounts, LazyContainersCardPorts, LazyContainersCardRaw, LazyContainersCardActions } from '#components'
import type { Container } from '~/types/containers/yachtContainers';
type DynamicComponent = typeof LazyContainersCardMounts | typeof LazyContainersCardPorts | typeof LazyContainersCardRaw | typeof LazyContainersCardActions

// Loading State
const loading = ref(false)

// Define Props
const props = defineProps<{ container: Container, server: string }>()
const reveal = useState(`reveal-${props.container.shortId}`, () => [] as DynamicComponent[])

// Define Dynamic Components
const mounts = markRaw(LazyContainersCardMounts)
const ports = markRaw(LazyContainersCardPorts)
const raw = markRaw(LazyContainersCardRaw)
const actions = markRaw(LazyContainersCardActions)

// Manage Expansion Array
const handleRevealButton = (component: DynamicComponent) => {
  const idx = reveal.value.indexOf(component)
  idx > -1 ? reveal.value.splice(idx, 1) : reveal.value.push(component)
}
</script>

<style>
.v-card--reveal {
  bottom: 0;
  opacity: 1 !important;
  position: absolute;
  width: 100%;
}
</style>
