<template>
  <span>
    <v-snackbar color="foreground" variant="elevated" location="bottom center" width="50vw" :timeout="-1" v-model="snackbar">
      <v-card-title>{{ progressTitle }}</v-card-title>
      <v-card-item v-for="progress, i in progressDict" :key="i">
        {{ progress.message }}
        <v-progress-linear :model-value="progress.status === 'Download complete' ? 100 : progress.progress || 0"
          color="primary" />
        {{ !Number.isNaN(progress.progress) ? `${progress.current} / ${progress.total}` : null }}
      </v-card-item>
    </v-snackbar>
  </span>
</template>

<script lang="ts" setup>
import type { Progress } from '~/types/notifications'
const connected = ref(false)
const snackbar = ref(false)
const progressTitle = ref('')
interface ProgressDict {
  [key: string]: {
    status: string;
    message: string;
    progress: number | null;
    current: string;
    total: string;
  }
}
const progressDict = ref<ProgressDict>({})

const { execute, data, pending } = useAsyncData(
  'progress-data',
  async () => {
    const abort = new AbortController()
    const sse = useSse('/api/progress', {
      async onopen(response) {
        if (response.ok) {
          console.log('Connected to progress SSE')
        } else {
          console.log('Failed to connect to notifications SSE')
          useToast({ title: 'Error', level: 'error', message: `Failed to connect to progress SSE: ${response.statusText}` })
          connected.value = false
        }
      },
      async onmessage(event) {
        connected.value = true
        const notification = JSON.parse(event.data) as Progress
        notificationProgress(notification as Progress)
      },
      signal: abort.signal,
      openWhenHidden: true,
    })
    return { sse, abort }
  },
  { lazy: true, immediate: false }
)

watch(() => Object.values(progressDict.value).filter(p => p.progress !== 100), (progressItems) => {
  snackbar.value = progressItems.length > 0;
}, { deep: true });

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

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

const notificationProgress = ({ id, item, progress }: Progress) => {
  if (Object.keys(progressDict.value).length === 0) {
    progressTitle.value = item
  }
  progressDict.value[id] = { message: `${progress.status} - ${progress.id}`, status: progress.status, total: formatBytes(progress.progressDetail.total || 0), current: formatBytes(progress.progressDetail.current || 0), progress: (progress.progressDetail.current || 0) / (progress.progressDetail.total || 0) * 100 }
  if (progress.status === 'Pull complete') {
    delete progressDict.value[id]
  }
}
</script>

<style></style>