<template>
  <div>
    <v-card ref="terminalCard" />
  </div>
</template>

<script lang="ts" setup>
import type { VCard } from 'vuetify/components'
import type { Terminal } from 'xterm'

import 'xterm/css/xterm.css';
const terminalCard: Ref<VCard | null> = useState('terminalRef', () => null)
const term: Ref<Terminal | null> = useState('terminal', () => null)
const command = ref("");
const sessionId = useState('sessionId', () => '')

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

onMounted(async () => {
  const { Terminal } = await import('xterm')
  const { AttachAddon } = await import('~/composables/xterm-ws-to-sse');
  term.value = new Terminal()

  const { eventSource, error } = useEventSource('/api/containers/local/38a384153b87/terminal')

  if (!eventSource.value) return console.error('Failed to connect to container SSE', error.value)
  console.log(eventSource.value)
  eventSource.value.addEventListener('message', (event) => {
    if (!sessionId.value) sessionId.value = JSON.parse(event.data)['id']
  })

  eventSource.value.onopen = (ev) => {
    console.log('Connected to container SSE')
  }

  const attachAddon = new AttachAddon(eventSource.value, { bidirectional: true, send: sendCommand, selector: 'data' })

  term.value.loadAddon(attachAddon)
  if (!terminalCard.value) return
  term.value.open(terminalCard.value.$el)
})
</script>

<style></style>