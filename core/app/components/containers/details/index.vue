<template>
  <div>
    <template v-if="container && container.name">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div class="space-y-5">
          <containers-details-card-namecard
            :container="container"
            :server="server"
          />
          <containers-details-card-info-body
            :container="container"
            :server="server"
          />
          <containers-details-card-environment
            v-if="!isMobile"
            :container="container"
            :server="server"
          />
        </div>
        <div class="space-y-5">
          <containers-details-card-networking
            :container="container"
            :server="server"
          />
          <containers-details-card-storage
            :container="container"
            :server="server"
          />
          <containers-details-card-environment
            v-if="isMobile"
            :container="container"
            :server="server"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { useContainersStore } from '#core/app/stores/containers';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

interface Props {
  server: string;
  name: string;
}

const { server } = defineProps<Props>();
const containersStore = useContainersStore();
const { container } = storeToRefs(containersStore);

// Breakpoints
const breakpoints = useBreakpoints(breakpointsTailwind)
const isMobile = breakpoints.smaller('md')
</script>
