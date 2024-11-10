<template>
  <Xterm
    v-if="attachAddon"
    ref="xterm"
    :attach-addon="attachAddon"
    term-type="terminal"
    @close="$emit('close')"
    @refresh="refresh()"
  >
    <template #btns>
      <!-- <v-tooltip v-if="isSupported" :text="'copy logs to clipboard'">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" icon @click="copy('')">
            <v-icon v-if="!copied"> mdi-content-copy </v-icon>
            <v-icon color="green" v-else> mdi-check </v-icon>
          </v-btn>
        </template>
      </v-tooltip> -->
    </template>
  </Xterm>
</template>

<script lang="ts" setup>
// app/components/containers/terminal.vue (updated sections)
import { useEventSource } from "@vueuse/core";
import type { Ref } from 'vue';
import { AttachAddon } from "~/composables/xterm-ws-to-sse";

interface Props {
  server: string;
  name: string;
}

const { server, name } = defineProps<Props>();
const fullscreen = ref(false);
const attachAddon = ref<AttachAddon | undefined>();
const sessionId = useState("sessionId", () => "");
const emit = defineEmits(["close"]);

const terminalSource: Ref<EventSource | undefined> = ref();
const closeTerminal: Ref<(() => void) | undefined> = ref();

// Make post request to send command to container
const sendCommand = async (data: ArrayBuffer | Uint8Array | string) => {
  // Include the session ID so we can get the correct container stream on backend
  if (!sessionId.value) return;
  
  try {
    await $fetch(`/api/containers/${server}/${name}/terminal`, {
      method: "POST",
      body: { id: sessionId.value, data },
    });
  } catch (error) {
    console.error('Failed to send command:', error);
  }
};

const getTerminal = async () => {
  const { eventSource, error, close } = useEventSource(
    `/api/containers/${server}/${name}/terminal`
  );

  if (!eventSource.value) {
    console.error("Failed to connect to container SSE", error.value);
    return;
  }

  terminalSource.value = eventSource.value;
  closeTerminal.value = close;

  eventSource.value.onopen = () => {
    console.log(`Connected to ${name} logs SSE`);
  };

  eventSource.value.addEventListener("message", (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data && data.id) {
        sessionId.value = data.id;
      }
    } catch (error) {
      console.error('Failed to parse message:', error);
    }
  });

  attachAddon.value = new AttachAddon(eventSource.value, {
    bidirectional: true,
    send: sendCommand,
    selector: "data",
  });
};

const refresh = () => {
  if (terminalSource.value) {
    closeTerminal.value?.();
    getTerminal();
  }
};

onMounted(() => {
  getTerminal();
});

onBeforeUnmount(() => {
  closeTerminal.value?.();
});
</script>

<style></style>
