<template>
  <v-container fluid>
    <v-tabs bg-color="surface" color="primry" align-tabs="center" v-model="tab">
      <v-tab v-for="server, i in Object.keys(servers)" :value="i" :key="i">
        {{ server }}
      </v-tab>
    </v-tabs>
    <v-toolbar class="px-2">
      <v-row>
        <v-col>
          <v-text-field v-model="search" clearable density="comfortable" hide-details placeholder="Search"
            prepend-inner-icon="mdi-magnify" style="max-width: 300px;" variant="solo"></v-text-field>
        </v-col>
        <v-spacer />
        <v-col cols="1" offset="1">
          <v-btn class="float-right" icon @click="containersStore.fetchContainers()" :loading="loading.includes('containers')">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-toolbar>
    <v-window v-model="tab" class="mt-5">
      <v-window-item v-for="server, i in Object.keys(servers)" :value="i" :key="i">
        <v-data-iterator v-if="servers[server].length > 0" :items="servers[server]" :search="search" :items-per-page="12">
          <template v-slot:default="{ items }">
            <v-row>
              <v-col v-for="container in items" :key="container.raw.id" cols="12" sm="6" md="4" lg="4" xl="3">
                <containers-card :container="container.raw" :server="server"></containers-card>
              </v-col>
            </v-row>
          </template>
          <template v-slot:footer="{ page, pageCount, prevPage, nextPage }">
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
            <v-card-title class="text-center">No containers found</v-card-title>
            <v-card-text class="text-center">
              <v-icon size="100">mdi-docker</v-icon>
              <div class="text-h6">Run a new container to see if here. </div>
              <i>If there should be containers running on this server, check the logs for errors.</i>
            </v-card-text>
          </v-card>
        </div>
      </v-window-item>
    </v-window>
  </v-container>
</template>

<script lang="ts" setup>
const search = useState('search', () => "")
const tab: Ref<number> = useState('tab', () => 0)
const containersStore = useContainersStore()
const { servers, loading } = storeToRefs(containersStore)
const notifications = notificationsConnected()

onMounted(async () => {
  await until(notifications).toBe(true)
  await containersStore.fetchContainers()
})
</script>

<style></style>