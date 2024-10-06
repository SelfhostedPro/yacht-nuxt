<template>
  <Xterm
    ref="xterm"
    v-if="attachAddon"
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
import { useClipboard, useEventSource } from "@vueuse/core";
import { AttachAddon } from "#imports";

interface Props {
  server: string;
  name: string;
}
const { server, name } = defineProps<Props>();
const fullscreen = ref(false);
const attachAddon = ref<AttachAddon | undefined>();
// const { isSupported, copy, copied, } = useClipboard()
const sessionId = useState("sessionId", () => "");
const emit = defineEmits(["close"]);

const terminalSource: Ref<EventSource | undefined> = ref();
const closeTerminal: Ref<(() => void) | undefined> = ref();

// Make post request to send command to container
const sendCommand = (data: ArrayBuffer | Uint8Array | string) => {
  // Include the session ID so we can get the correct container stream on backend
  if (!sessionId.value) return;
  $fetch(`/api/containers/${server}/${name}/terminal`, {
    method: "POST",
    body: JSON.stringify({ id: sessionId.value, data: data }),
  });
};

const refresh = () => {
  if (terminalSource.value) {
    closeTerminal.value?.();
    getTerminal();
  }
};

const getTerminal = async () => {
  const { eventSource, error, close } = useEventSource(
    `/api/containers/${server}/${name}/terminal`
  );
  if (!eventSource.value)
    return console.error("Failed to connect to container SSE", error.value);
  // Add eventsource refs to component refs
  terminalSource.value = eventSource.value;
  closeTerminal.value = close;
  // Attach event listeners
  eventSource.value.onopen = () => {
    console.log(`Connected to ${name} logs SSE`);
  };
  eventSource.value.addEventListener("message", (event) => {
    sessionId.value = JSON.parse(event.data)["id"];
  });
  // Initialize attachAddon
  attachAddon.value = new AttachAddon(eventSource.value, {
    bidirectional: true,
    send: sendCommand,
    selector: "data",
  });
};

onMounted(async () => {
  getTerminal();
});

onBeforeUnmount(() => {
  closeTerminal.value?.();
});
</script>

<style></style>
