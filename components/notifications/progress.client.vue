<template>
  <v-bottom-sheet inset persistent no-click-animation v-model="snackbar" :scrim="false">
    <v-card variant="elevated" color="surface">
      <v-toolbar>
        <v-toolbar-title><v-btn variant="plain" icon @click="expanded['__root'] = !expanded['__root']"><v-icon
              :icon="expanded['__root'] ? 'mdi-chevron-down' : 'mdi-chevron-up'" /></v-btn>progress</v-toolbar-title>
      </v-toolbar>
      <v-expand-transition v-show="expanded['__root']">
        <div>
        <v-card :rounded="false" v-for="(parent, title, i) in progressDict" :key="i">
          <v-card-title class="text-center">
            <!-- <v-btn variant="plain" icon @click="expanded[title] = !expanded[title]"><v-icon
                :icon="expanded[title] ? 'mdi-chevron-down' : 'mdi-chevron-up'" /></v-btn> -->
            {{ title }}
          </v-card-title>
          <!-- <v-expand-transition v-show="expanded[title]" class="bg-foreground rounded"> -->
          <div>
            <v-card-item class="mt-1" v-for="(progress, i) in parent" :key="i">
              <v-card-subtitle> {{ progress.message }} {{ !Number.isNaN(progress.progress) ? `- ${progress.current} /
                              ${progress.total}` :
                null
              }}</v-card-subtitle>
              <v-progress-linear :model-value="progress.status === 'Download complete' ? 100 : progress.progress || 0"
                color="primary" />
            </v-card-item>
          </div>
          <!-- </v-expand-transition> -->
        </v-card>
      </div>
      </v-expand-transition>
    </v-card>
  </v-bottom-sheet>
</template>

<script lang="ts" setup>
import type { Progress } from '~/types/notifications'
const notifications = notificationsConnected()
const connected = ref(false)
const snackbar = ref(false)
const expanded = ref<{ [key: string]: boolean }>({
  '__root': true
})
interface ProgressDict {
  [key: string]: {
    [key: string]: {
      status: string;
      message: string;
      progress?: number | null;
      current: string;
      total: string;
    }
  }
}
const progressDict = ref<ProgressDict>({
  // 'test': {
  //   'test': {
  //     status: 'test',
  //     message: 'pulling - test',
  //     progress: 30,
  //     current: '0',
  //     total: '0'
  //   },
  //   'downloading - test': {
  //     status: 'test',
  //     message: 'test',
  //     progress: 100,
  //     current: '0',
  //     total: '0'
  //   },
  //   'image - extracting': {
  //     status: 'test',
  //     message: 'test',
  //     progress: 90,
  //     current: '0',
  //     total: '0'
  //   },
  //   'image - pulling': {
  //     status: 'test',
  //     message: 'test',
  //     progress: 70,
  //     current: '0',
  //     total: '0'
  //   }
  // }
})

const { execute, data, pending } = useAsyncData(
  'progress-data',
  async () => {
    await until(notifications).toBe(true)
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
        const notification = JSON.parse(event.data)
        notificationProgress(notification as Progress)
      },
      signal: abort.signal,
      openWhenHidden: true,
    })
    return { sse, abort }
  },
  { lazy: true, immediate: false }
)

watch(progressDict.value, () => {
  snackbar.value = Object.keys(progressDict.value).length > 0
}, { deep: true })


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

const notificationProgress = ({ id, title, item, progress }: Progress) => {
  const progressDetail = progress.progressDetail;
  if (!progressDetail) return; // Early return if progressDetail is undefined

  if (!progressDict.value[title]) {
    progressDict.value[title] = {};
    expanded.value[title] = true;
  }

  const formattedCurrent = formatBytes(progressDetail.current);
  const formattedTotal = formatBytes(progressDetail.total);
  const calculatedProgress = (progressDetail.current / progressDetail.total) * 100;

  progressDict.value[title][id] = {
    message: `${progress.status} - ${progress.id}`,
    status: progress.status,
    total: formattedTotal,
    current: formattedCurrent,
    progress: calculatedProgress
  };

  if (progress.status === 'Pull complete') {
    delete progressDict.value[title][id];
  } else if (
    progress.status === `Status: Image is up to date for ${item}` ||
    progress.status === `Status: Downloaded newer image for ${item}`
  ) {
    delete progressDict.value[title];
  }
  if (Object.keys(progressDict.value[title]).length === 0) {
    delete progressDict.value[title];
  }
};

</script>

<style></style>~/shared/notifications