import { defineStore } from 'pinia'
import type { NotificationEvent } from '~/types/notifications'

export const useNotificationsStore = defineStore({
  id: 'NotificationsStore',
  state: () => ({
    notifications: [] as NotificationEvent[],
    controller: () => {}
  }),
  actions: {
    async subscribe() {
      const { data, error, close, eventSource } = useEventSource('/api/notifications')
      if (eventSource.value) eventSource.value.onmessage = (event) => {
        this.controller = close
        this.notifications.push(event.data)
      }
    }
  }
})
