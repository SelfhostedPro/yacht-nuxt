import type { Notification, NotificationWithID } from '../../types/notifications'
export const useNotificationsStore = defineStore('lv-notificationsStore', {
    state: () => ({
        connected: false,
        notifications: [] as NotificationWithID[],
        recentNotifications: [] as NotificationWithID[]
    }),
    actions: {
        async removeToast(id: string | number, recent: boolean) {
            recent
                ? this.notifications = this.notifications.filter(({ id: notificationID }) => notificationID !== id)
                : this.recentNotifications = this.recentNotifications.filter(({ id: notificationID }) => notificationID !== id)
        },
        async pushToast(notification: Notification) {
            // useLVToast imported from @labvue/ui/composables/toast.ts
            const id = useLVToast(notification)

            if (id === undefined) return

            // Push to notification state array. Add a timeout to remove it from the notifications if it's been closed.
            this.notifications.push({ id, ...notification })

            // Push to recent notifications array. This is used to prevent notifications from appearing too frequently.
            if (notification.dedupe) {
                this.recentNotifications.push({ id, ...notification })
            }
        },
        async connect() {
            const { close, data, error, eventSource, open, status, event, } = useEventSource('/api/notifications', [],
                {
                    autoReconnect: {
                        retries: 3,
                        delay: 1000,
                        onFailed() {
                            console.log('Failed to connect to the Notifications SSE Endpoint.')
                        }
                    },
                })
            if (error.value) throw error.value
            if (eventSource.value) {
                eventSource.value.onopen = (ev) => {
                    console.log('connected to notifications SSE', ev)
                    this.connected = true
                    // this.$patch({ connected: true })
                }
                eventSource.value.onmessage = (ev) => {
                    this.pushToast(JSON.parse(ev.data) as Notification)
                }
            }

            return { close, data, error, eventSource, open, status, event }
        },
    }
})