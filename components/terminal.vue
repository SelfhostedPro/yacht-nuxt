<template>
  <v-container ref="terminalCard" color="foreground" />
</template>

<script lang="ts" setup>
import type { VCard } from 'vuetify/components'
import type { Terminal } from 'xterm'
import type { FitAddon } from 'xterm-addon-fit'

import 'xterm/css/xterm.css';
const terminalCard: Ref<VCard | null> = useState('terminalRef', () => null)
const term: Ref<Terminal | null> = useState('terminal', () => null)
const fitAddon: Ref<FitAddon | null> = useState('fitAddon', () => null)
const command = ref("");
const sessionId = useState('sessionId', () => '')
const notifications = notificationsConnected()

// Make post request to send command to container
const sendCommand = (data: ArrayBuffer | Uint8Array | string) => {
  console.log(data)
  // Include the session ID so we can get the correct container stream on backend
  if (!sessionId.value) return
  $fetch(`/api/containers/local/38a384153b87/terminal`, {
    method: 'POST',
    body: JSON.stringify({ id: sessionId.value, data: data })
  })
}

const resize = () => {
  if (!fitAddon.value) return
  fitAddon.value.fit()
}

onMounted(async () => {
  const { Terminal } = await import('xterm')
  const { AttachAddon } = await import('~/composables/containers/xterm-ws-to-sse');
  const { FitAddon } = await import('xterm-addon-fit')
  term.value = new Terminal()

  // Getting SSE Stream for container output
  await until(notifications).toBe(true)
  const { eventSource, error } = useEventSource('/api/containers/local/38a384153b87/terminal')
  if (!eventSource.value) return console.error('Failed to connect to container SSE', error.value)
  eventSource.value.addEventListener('message', (event) => {
    if (!sessionId.value) sessionId.value = JSON.parse(event.data)['id']
  })
  eventSource.value.onopen = (ev) => {
    console.log('Connected to container SSE')
  }
  eventSource.value.onerror = (ev) => {
    console.error('Failed to connect to container SSE', ev)
    eventSource.value?.close()
  }
  const attachAddon = new AttachAddon(eventSource.value, { bidirectional: true, send: sendCommand, selector: 'data' })
  fitAddon.value = new FitAddon()

  if (!terminalCard.value) return
  terminalCard.value.$el.addEventListener('resize', resize)
  term.value.loadAddon(attachAddon)
  term.value.loadAddon(fitAddon.value)
  term.value.open(terminalCard.value.$el)
  term.value.focus()
  fitAddon.value.fit()
})
</script>

<style></style>~/composables/containers/xterm-ws-to-sse