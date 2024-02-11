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
        <v-col v-if="selectedItems.length > 0">
          <slot name="bulk-buttons" :selectedItems="selectedItems" :server="Object.keys(resource)[tab]" />
        </v-col>
        <v-col cols="3" class="d-flex justify-end">
          <slot name="buttons" />
        </v-col>
      </v-row>
    </v-toolbar>
    <v-window v-model="tab" class="mt-5">
      <v-window-item v-for="server, i in Object.keys(resource)" :key="i" :value="i">
        <slot name="heading" :selectedItems="selectedItems" :server="server" />
        <v-data-iterator v-model:model-value="selectedItems" v-if="resource[server].length > 0" :items="resource[server]"
          :search="search" :item-value="name === 'volumes' ? 'Id' : 'id'" :items-per-page="12" multiple show-expand
          show-select>
          <template #default="{ items, ...rest }">
            <v-row>
              <v-col v-for="_resource, i in items" :key="i" cols="12" sm="6" md="4" lg="4" xl="3">
                <slot name="card" :server="server" :resource="_resource" v-bind="rest" />
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
              {{ selectedItems }}
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
  </v-container>
</template>
<script setup lang="ts">
import { ResourcesListImageCard, ResourcesListNetworkCard, ResourcesListVolumeCard } from '#components'
import type { NetworkInspectInfo, ImageInfo, VolumeInspectInfo } from 'dockerode';
import type { ServerContainers, ServerImages, ServerNetworks, ServerVolumes } from '~/types/servers';
import type { YachtTemplate } from '~/types/templates/yacht';
const selectedItems = ref<string[]>([])
interface Props {
  name: string
  resource: ServerContainers | ServerNetworks | ServerVolumes | ServerImages
  loading: boolean
}
const props = defineProps<Props>()

const tab = ref(0)
const search = ref('')

</script>