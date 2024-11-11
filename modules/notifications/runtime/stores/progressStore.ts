import NotificationsProgress from "../components/progress.vue"
import { useProgress } from "../composables/progress"

export const useProgressStore = defineStore('lv-progressStore', {
    state: () => ({
        connected: false,
        progress: {} as ProgressDict,
    }),
    actions: {
        async removeToast(id: string | number) {
            // Use Reflect.deleteProperty instead of delete
            Reflect.deleteProperty(this.progress, id)
        },
        async connect() {
            const { close, data, error, eventSource, open, status, event, } = useEventSource('/api/progress', [],
                {
                    autoReconnect: {
                        retries: 3,
                        delay: 1000,
                        onFailed() {
                            console.log('Failed to connect to the Progress SSE Endpoint.')
                        }
                    },
                })
            if (error.value) throw error.value
            if (eventSource.value) {
                eventSource.value.onopen = (ev) => {
                    console.log('connected to progress SSE', ev)
                    this.connected = true
                }
                eventSource.value.onmessage = async (ev) => {
                    if (typeof JSON.parse(ev.data) === 'string') return
                    await this.notificationProgress(JSON.parse(ev.data) as ProgressUpdate | ProgressTitleUpdate);
                    console.log(JSON.parse(ev.data))
                }
            }

            return { close, data, error, eventSource, open, status, event }
        },
        async notificationProgress(progress: ProgressUpdate | ProgressTitleUpdate) {
            if (!this.progress[progress.id]) {
                // If item's not in the progress store, add it.
                this.progress[progress.id] = {
                    id: progress.id,
                    title: progress.title || progress.id,
                    items: {}
                };
            }

            const progressItem = this.progress[progress.id];
            if (!progressItem) return;

            if (("item" in progress)) {
                // If item, just update the item value.
                if (progressItem.items) {
                    progressItem.items[progress.item.id] = progress.item;
                    if (progress.item.status === 'done') {
                        Reflect.deleteProperty(progressItem.items, progress.item.id);
                    }
                }
            } else {
                // If no item, update the title
                progressItem.title = progress.title;
                await useProgress(progress, NotificationsProgress);
            }
        }
    }
})
