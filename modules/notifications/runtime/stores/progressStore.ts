import NotificationsProgress from "../components/progress.vue"
import { useProgress } from "../composables/progress"
export const useProgressStore = defineStore('lv-progressStore', {
    state: () => ({
        connected: false,
        progress: {} as ProgressDict,
    }),
    actions: {
        async removeToast(id: string | number) {
            delete this.progress[id]
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
                    // this.$patch({ connected: true })
                }
                eventSource.value.onmessage = async (ev) => {
                    if (typeof JSON.parse(ev.data) === 'string') return
                    await this.notificationProgress(JSON.parse(ev.data) as ProgressUpdate | ProgressTitleUpdate);
                    console.log(JSON.parse(ev.data))
                }
                eventSource.value.onerror = (ev) => {
                    console.log('error', ev)
                    this.progress = {}
                    close()
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
            if (("item" in progress)) {
                // If item, just update the item value.
                this.progress[progress.id]!.items[progress.item.id] = progress.item
                if (progress.item.status === 'done') delete this.progress[progress.id]!.items[progress.item.id]
            } else {
                // If no item, update the title
                this.progress[progress.id]!.title = progress.title
                await useProgress(progress, NotificationsProgress)
            }
            // const formattedCurrent = formatBytes(progressDetail.current);
            // const formattedTotal = formatBytes(progressDetail.total);
            // const calculatedProgress =
            // (progressDetail.current / progressDetail.total) * 100;

            // progressDict.value[title][id] = {
            //     message: `${progress.status} - ${progress.id}`,
            //     status: progress.status,
            //     total: formattedTotal,
            //     current: formattedCurrent,
            //     progress: calculatedProgress,
            // };

            // if (progress.status === "Pull complete") {
            //     delete progressDict.value[title][id];
            // } else if (
            //     progress.status === `Status: Image is up to date for ${item}` ||
            //     progress.status === `Status: Downloaded newer image for ${item}`
            // ) {
            //     delete progressDict.value[title];
            // }
            // if (Object.keys(progressDict.value[title]).length === 0) {
            //     delete progressDict.value[title];
            // }
        }
    }
})