<template>
  <v-sonner v-if="!pending" />
</template>

<script lang="ts" setup>
import { VSonner, toast } from 'vuetify-sonner';
import 'vuetify-sonner/style.css'
import type { Notification } from '~/types/notifications';
const connected = notificationsConnected()

const { execute, data, pending, refresh, error } = useAsyncData(
  'notification-data',
  async () => {
    const abort = new AbortController()
    const sse = useSse('/api/notifications', {
      async onopen(response) {
        if (response.ok) {
          console.log('Connected to notifications SSE')
        } else {
          console.log('Failed to connect to notifications SSE')
          useToast({ title: 'Error', level: 'error', message: `Failed to connect to notifications SSE: ${response.statusText}` })
          connected.value = false
        }
      },
      async onmessage(event) {
        connected.value = true
        const notification = JSON.parse(event.data) as Notification
        useToast(notification)
      },
      signal: abort.signal
    })
    return { sse, abort }
  },
  { lazy: true, immediate: false }
)
onMounted(async () => {
  if (!connected.value && !data.value) {
    await execute()
  }
})
onBeforeUnmount(async () => {
  if (data.value?.abort) {
    data.value.abort.abort()
  }
})
</script>

<style>
.card-snackbar {
  max-width: 100% !important;
}
</style>