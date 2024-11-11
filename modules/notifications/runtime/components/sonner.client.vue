<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <span>
    <Toaster
      position="bottom-right"
      close-button
      :style="{ width: smAndDown ? '100%' : '30%' }"
    />
  </span>
</template>

<script lang="ts" setup>
import { Toaster } from "vue-sonner";

const { smAndDown } = useDisplay();
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
onBeforeUnmount(async () => {});
</script>

<style>
@media screen and (max-width: 960px) {
  [data-sonner-toast] {
    right: 0vw !important;
    bottom: 0vw !important;
  }
}
[data-sonner-toast] {
  overflow: visible;
  left: auto !important;
  right: 3vw !important;
  bottom: 3vw !important;
  position: fixed !important;
}
</style>
