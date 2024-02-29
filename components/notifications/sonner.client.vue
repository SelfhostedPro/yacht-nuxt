<template>
  <span>
    <v-sonner v-if="!pending" />
  </span>
</template>

<script lang="ts" setup>
import { VSonner } from 'vuetify-sonner';
import 'vuetify-sonner/style.css'
import type { Notification } from '~/types/notifications';
const connected = notificationsConnected()
const route = useRoute()

const { execute, data, pending } = useAsyncData(
  'notification-data',
  async () => {
    const abort = new AbortController()
    const sse = useSse('/api/notifications', {
      async onopen(response) {
        if (response.ok) {
          console.log('Connected to notifications SSE')
        } else {
          if (route.path === '/login') return
          console.log('Failed to connect to notifications SSE')
          if (response.status === 401) {
            useToast({ title: 'Unauthorized', level: 'error', message: `Failed to connect!\nPlease check server logs for more detailed information.`})
          } else {
            useToast({ title: 'Error', level: 'error', message: `Failed to connect to notifications SSE: ${response.statusText}` })
          }
          connected.value = false
        }
      },
      async onmessage(event) {
        console.log('Received notification')
        connected.value = true
        const notification = JSON.parse(event.data) as Notification
        useToast(notification)
      },
      signal: abort.signal,
      openWhenHidden: true,
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
</style>~/shared/notifications