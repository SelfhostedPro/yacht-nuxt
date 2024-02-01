<template>
  <v-container fluid class="px-0">
    <v-tabs v-model="tab" bg-color="surface" color="primry" align-tabs="center">
      <v-tab v-for="server, i in Object.keys(resource)" :key="i" :value="i">
        {{ server }}
      </v-tab>
    </v-tabs>
    <v-toolbar class="px-2">
      <v-row justify="space-between">
        <v-col>
          <v-text-field v-model="search" clearable density="comfortable" hide-details placeholder="Search"
            prepend-inner-icon="mdi-magnify" style="max-width: 300px;" variant="solo" />
        </v-col>
        <v-col cols="3" class="d-flex justify-end">
          <containers-create />
          <v-btn icon :loading="loading.includes('containers')" @click="">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-toolbar>
    <v-window v-model="tab" class="mt-5">
      <v-window-item v-for="server, i in Object.keys(resource)" :key="i" :value="i">
        <v-data-iterator v-if="resource[server].length > 0" :items="resource[server]" :search="search"
          :items-per-page="12">
          <template #default="{ items }">
            <v-row>
              <v-col v-for="_resource, i in items" :key="i" cols="12" sm="6" md="4" lg="4" xl="3">
                <resources-list-network-card v-if="name === 'networks'" :server="server"
                  :resource="(resource[server][i] as NetworkInspectInfo)" />
                <resources-list-image-card v-if="name === 'images'" :server="server"
                  :resource="(resource[server][i] as ImageInfo)" />
                <resources-list-volume-card v-if="name === 'volumes'" :server="server"
                  :resource="(resource[server][i] as VolumeInspectInfo)" />
              </v-col>
            </v-row>
          </template>
          <template #footer="{ page, pageCount, prevPage, nextPage }">
            <div class="d-flex align-center justify-center pa-4">
              <v-btn :disabled="page === 1" icon="mdi-arrow-left" density="comfortable" variant="tonal" rounded
                @click="prevPage" />
              <div class="mx-2 text-caption">
                Page {{ page }} of {{ pageCount }}
              </div>
              <v-btn :disabled="page >= pageCount" icon="mdi-arrow-right" density="comfortable" variant="tonal" rounded
                @click="nextPage" />
            </div>
          </template>
        </v-data-iterator>
        <div v-else>
          <v-card class="pa-3">
            <v-card-title class="text-center">
              No {{ name }}s found
            </v-card-title>
            <v-card-text class="text-center">
              <v-icon size="100">
                mdi-docker
              </v-icon>
              <div class="text-h6">
                Create a new {{ name }} to see it here.
              </div>
              <i>If there should be {{ name }}s on this server, check the logs for errors.</i>
            </v-card-text>
          </v-card>
        </div>
      </v-window-item>
    </v-window>
    <!-- {{ JSON.stringify(resource) }} -->
  </v-container>
</template>
<script setup lang="ts">
import { ResourcesListImageCard, ResourcesListNetworkCard, ResourcesListVolumeCard } from '#components'
import type { NetworkInspectInfo, ImageInfo, VolumeInspectInfo } from 'dockerode';
interface Props {
  name: 'networks' | 'volumes' | 'images'
}
const props = defineProps<Props>()
const resourcesStore = useResourcesStore()
const { loading, [props.name]: resource } = storeToRefs(resourcesStore)
const tab = ref(0)
const search = ref('')
const notifications = notificationsConnected()

const Cards = {
  images: markRaw(ResourcesListImageCard),
  networks: markRaw(ResourcesListNetworkCard),
  volumes: markRaw(ResourcesListVolumeCard),
}

const refresh = async () => {
  await until(notifications).toBe(true)
  await useAsyncData(props.name + 'list', () => resourcesStore.fetchResources(props.name), {
    default() {
      return {}
    },
  })
}
onMounted(async () => {
  refresh()
})

// const loadingStore = useLoadingStore()
// const resourceStore = useResourceStore();
// const { isLoading } = storeToRefs(loadingStore)
// const resources = storeToRefs(resourceStore)
// const serverTab = ref(0)
// const searchQuery = ref('')
// watch(() => props.name, async () => {
//   DynamicComponent = defineAsyncComponent(() => import(`./list/${props.name}-card.vue`));
//   await resourceStore.fetchResources(props.name)
// })

// onMounted(async () => {
//   await resourceStore.fetchResources(props.name)
// })

</script>