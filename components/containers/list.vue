<template>
  <v-container fluid>
    <v-tabs bg-color="surface" color="primary" align-tabs="center" v-model="tab">
      <v-tab v-for="server, i in Object.keys(containers.servers)" :value="i" :key="i">
        {{ server }}
      </v-tab>
    </v-tabs>
    <v-toolbar class="px-2">
      <v-text-field v-model="search" clearable density="comfortable" hide-details placeholder="Search"
        prepend-inner-icon="mdi-magnify" style="max-width: 300px;" variant="solo"></v-text-field>
    </v-toolbar>
    <v-window v-model="tab" class="mt-5">
      <v-window-item v-for="server, i in Object.keys(containers.servers)" :value="i" :key="i">
        <v-data-iterator :items="containers.servers[server]" :search="search" :items-per-page="10">
          <template v-slot:default="{ items }">
            <v-row>
              <v-col v-for="container in items" :key="container.raw.id" cols="12" sm="6" md="4" lg="4" xl="3">
                <containers-card :container="container.raw"></containers-card>
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
      </v-window-item>
    </v-window>
  </v-container>
</template>

<script lang="ts" setup>
const search = useState('search', () => "")
const tab = useState('tab')
const containers = useContainersStore()

await callOnce(containers.fetchContainers)
</script>

<style></style>