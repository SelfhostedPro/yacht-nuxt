<template>
  <v-card
    class="pa-2 justify-start"
    density="compact"
    style="transition: height 0.3s ease-in-out; position: relative;"
    :loading="loading ? 'primary' : false"
  >
    <containers-card-stats
      v-if="stats"
      :stats="(stats as ContainerStat)"
    />
    <v-row
      dense
      no-gutters
    >
      <v-col>
        <containers-card-base :container="container" />
      </v-col>
    </v-row>
    <v-row
      dense
      no-gutters
      class="align-center justify-start"
    >
      <v-col>
        <!-- Expansion Buttons -->
        <v-btn-toggle
          v-model="reveal"
          :rounded="false"
          multiple
          variant="text"
          color="primary"
        >
          <v-btn
            :active="reveal.includes(actions)"
            :icon="reveal.includes(actions) ? 'mdi-chevron-up' : 'mdi-chevron-down'"
            :value="actions"
          />
          <v-btn
            v-if="container.mounts && container.mounts[0]"
            :active="reveal.includes(mounts)"
            :icon="reveal.includes(mounts) ? 'mdi-file-tree' : 'mdi-file-tree-outline'"
            :value="mounts"
          />
          <v-btn
            v-if="container.ports && container.ports[0]"
            :active="reveal.includes(ports)"
            :icon="reveal.includes(ports) ? 'mdi-lan-pending' : 'mdi-lan-connect'"
            :value="ports"
          />
          <v-btn
            :active="reveal.includes(raw)"
            :icon="reveal.includes(raw) ? 'mdi-code-braces-box' : 'mdi-code-braces'"
            :value="raw"
          />
        </v-btn-toggle>
      </v-col>
    </v-row>
    <!-- Expansion Ref -->
    <ul v-auto-animate>
      <!-- Dynamic Components -->
      <component
        :is="revealItem"
        v-for="revealItem, i in reveal"
        :key="i"
        :mounts="container.mounts && container.mounts[0] ? container.mounts : []"
        :ports="container.ports && container.ports[0] ? container.ports : []"
        :labels="container.labels"
        :container="reveal.includes(raw) || reveal.includes(actions) ? container : null"
        :server="reveal.includes(actions) ? server : null"
        @start-loading="loading = true"
        @stop-loading="loading = false"
      />
    </ul>
  </v-card>
</template>

<script lang="ts" setup>
import { LazyContainersCardMounts, LazyContainersCardPorts, LazyContainersCardRaw, LazyContainersCardActions } from '#components'
import type { Container, ContainerStat } from '~/types/containers/yachtContainers';
type DynamicComponent = typeof LazyContainersCardMounts | typeof LazyContainersCardPorts | typeof LazyContainersCardRaw | typeof LazyContainersCardActions

// Loading State
const loading = ref(false)

// Define Props
const props = defineProps<{ container: Container, stats?: ContainerStat, server: string }>()
const reveal = useState(`reveal-${props.container.shortId}`, () => [] as DynamicComponent[])

// Define Dynamic Components
const mounts = markRaw(LazyContainersCardMounts)
const ports = markRaw(LazyContainersCardPorts)
const raw = markRaw(LazyContainersCardRaw)
const actions = markRaw(LazyContainersCardActions)

</script>

<style>
.v-card--reveal {
  bottom: 0;
  opacity: 1 !important;
  position: absolute;
  width: 100%;
}
</style>

<!-- <template>
    <v-card class="pa-2 justify-start" density="compact">
      <v-row dense no-gutters class="align-start">
        <v-col>
          <containers-card-base :container="container" />
          <v-row>
            
          </v-row>
          <transition
            name="expand"
            @before-enter="beforeEnter"
            @enter="enter"
            @before-leave="beforeLeave"
            @leave="leave"
          >
            <div v-if="reveal.length > 0">
              <component v-for="(revealItem, i) in reveal" :key="i"
                         :is="revealItem"
                         v-bind:mounts="container.mounts && container.mounts[0] ? container.mounts : []"
                         v-bind:ports="container.ports && container.ports[0] ? container.ports : []" />
            </div>
          </transition>
        </v-col>
      </v-row>
    </v-card>
  </template> 
  
  <script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { ContainersCardMounts, ContainersCardPorts } from '#components';
  import type { Container } from '~/types/containers/yachtContainers';
  
  const props = defineProps<{ container: Container }>();
  const reveal = ref([] as Array<typeof ContainersCardMounts | typeof ContainersCardPorts>);
  
  function beforeEnter(el) {
    el.style.height = '0';
  }
  
  function enter(el, done) {
    el.style.height = `${el.scrollHeight}px`;
    el.style.overflow = 'hidden';
    done();
  }
  
  function beforeLeave(el) {
    el.style.height = `${el.scrollHeight}px`;
    el.style.overflow = 'hidden';
  }
  
  function leave(el, done) {
    el.style.height = '0';
    done();
  }
  
  // Other methods...
  </script>
  
  <style>
  .expand-enter-active, .expand-leave-active {
    transition: height 0.3s ease;
  }
  .expand-enter-from, .expand-leave-to {
    height: 0;
  }
  </style>
  -->