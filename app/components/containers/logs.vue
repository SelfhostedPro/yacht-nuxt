<template>
  <Xterm
    ref="xterm"
    v-if="attachAddon"
    :attach-addon="attachAddon"
    term-type="logs"
    @close="$emit('close')"
    @refresh="refresh()"
  >
    <template #btns>
      <v-tooltip v-if="isSupported" :text="'copy logs to clipboard'">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon @click="copy('')">
            <v-icon v-if="!copied"> mdi-content-copy </v-icon>
            <v-icon color="green" v-else> mdi-check </v-icon>
          </v-btn>
        </template>
      </v-tooltip>
    </template>
  </Xterm>
</template>
<script lang="ts" setup>
import { useClipboard, useEventSource } from "@vueuse/core";
import { AttachAddon } from "#imports";

import { Xterm } from "#components";
interface Props {
  server: string;
  name: string;
}

// Props
const { server, name } = defineProps<Props>();

// Used to wait for connection to initialize on refresh

// Window Controls
const timestamps = ref(false);
const emit = defineEmits(["close"]);
const { isSupported, copy, copied } = useClipboard();
const loading = ref(false);

// Terminal Refs
const xterm: Ref<typeof Xterm | undefined> = ref();
const attachAddon = ref<AttachAddon | undefined>();
const logSource = ref<EventSource | undefined>();
const closeLogs: Ref<(() => void) | undefined> = ref();

const refresh = async () => {
  if (logSource.value) {
    closeLogs.value?.();
    getLogs();
  }
};

const getLogs = async () => {
  const { eventSource, error, close } = useEventSource(
    `/api/containers/${server}/${name}/logs`
  );
  if (!eventSource.value)
    return console.error("Failed to connect to container SSE", error.value);
  // Add eventsource refs to component refs
  logSource.value = eventSource.value;
  closeLogs.value = close;
  // Attach event listeners
  eventSource.value.onopen = () => {
    console.log(`Connected to ${name} logs SSE`);
    loading.value = false;
  };
  eventSource.value.onerror = (ev) => {
    console.error("Failed to connect to container SSE", ev);
    eventSource.value?.close();
    loading.value = false;
  };
  // Create attachAddon for writing data to the terminal
  attachAddon.value = new AttachAddon(eventSource.value, {
    bidirectional: false,
  });
};

onMounted(async () => {
  await getLogs();
});

onBeforeUnmount(() => {
  closeLogs.value?.();
});
</script>

<style></style>
