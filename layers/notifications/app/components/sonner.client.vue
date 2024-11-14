<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <Toaster position="bottom-right" :class="breakpoints.smaller('sm') ? 'w-full' : 'w-[30%]'" />
</template>

<script lang="ts" setup>
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { useNotificationsStore } from "#notifications/app/stores/notificationsStore";
import { useProgressStore } from "#notifications/app/stores/progressStore";
import { Toaster } from '#ui/app/components/ui/sonner';

const breakpoints = useBreakpoints(breakpointsTailwind)
const notificationsStore = useNotificationsStore();
const { connected: notificationsConnected } = storeToRefs(notificationsStore);
const progressStore = useProgressStore();
const { connected: progressConnected } = storeToRefs(progressStore);

onMounted(async () => {
  console.log("onmounted connectd", notificationsConnected.value);
  if (!notificationsConnected.value) {
    console.log(`connecting to notifications endpoint...`);
    await notificationsStore.connect();
  }

  if (!progressConnected.value) {
    console.log("connecting to progress endpoint...");
    await progressStore.connect();
  }
});
</script>
