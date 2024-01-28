<template>
  <v-container fluid>
    <!-- <template v-if="loading.includes('containers')">
      <v-card>
        <v-card-title class="text-center">
          Loading Containers
        </v-card-title>
      </v-card>
    </template> -->
    <v-tabs v-model="tab" bg-color="surface" color="primry" align-tabs="center">
      <v-tab v-for="server, i in Object.keys(servers)" :key="i" :value="i">
        {{ server }}
      </v-tab>
    </v-tabs>
    <v-toolbar class="px-2">
      <v-row justify="space-between">
        <v-col>
          <v-text-field v-model="search" clearable density="comfortable" hide-details placeholder="Search"
            prepend-inner-icon="mdi-magnify" style="max-width: 300px;" variant="solo" />
        </v-col>
        <v-spacer />
        <v-col cols="2" class="d-flex justify-end">
          <containers-create />
          <v-btn icon :loading="loading.includes('containers')" @click="refresh()">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-toolbar>
    <v-window v-model="tab" class="mt-5">
      <v-window-item v-for="server, i in Object.keys(servers)" :key="i" :value="i">
        <v-data-iterator v-if="servers[server].length > 0" :items="servers[server]" :search="search" :items-per-page="12">
          <template #default="{ items }">
            <v-row>
              <v-col v-for="container in items" :key="container.raw.id" cols="12" sm="6" md="4" lg="4" xl="3">
                <lazy-containers-list-card :container="container.raw" :server="server"
                  :stats="stats[container.raw.name] || undefined" />
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
              No containers found
            </v-card-title>
            <v-card-text class="text-center">
              <v-icon size="100">
                mdi-docker
              </v-icon>
              <div class="text-h6">
                Run a new container to see if here.
              </div>
              <i>If there should be containers running on this server, check the logs for errors.</i>
            </v-card-text>
          </v-card>
        </div>
      </v-window-item>
    </v-window>
    <!-- <template v-else>
      <v-card class="pa-3">
        <v-card-title class="text-center">
          No Servers Found
        </v-card-title>
        <v-card-text class="text-center">
          <v-icon size="100">
            mdi-docker
          </v-icon>
          <div class="text-h6">
            Check your configuration and server logs to see if there are any errors.
          </div>
          <i>If everything looks right, check to make sure that docker is running correctly.</i>
        </v-card-text>
      </v-card>
    </template> -->
  </v-container>
</template>

<script lang="ts" setup>
const search = useState('search', () => "")
const tab: Ref<number> = useState('tab', () => 0)
const containersStore = useContainersStore()
const { servers, loading, stats } = storeToRefs(containersStore)
const notifications = notificationsConnected()

const refresh = async () => {
  await until(notifications).toBe(true)
  await useAsyncData('containerList', () => containersStore.fetchContainers(), {
    default() {
      return {}
    },
  })
  await useAsyncData('containerStats', () => containersStore.fetchContainerStats(), {
    default() {
      return {}
    },
  })

}



onMounted(() => {
  refresh()
})
</script>

<style></style>