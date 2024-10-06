<template>
  <v-container fluid class="p-0">
    <v-tabs v-model="tab" bg-color="surface" color="primry" align-tabs="center">
      <v-tab v-for="(server, i) in Object.keys(resource)" :key="i" :value="i">
        {{ server }}
      </v-tab>
    </v-tabs>
    <v-toolbar class="px-2">
      <v-row justify="space-between">
        <v-col>
          <v-text-field
            v-model="search"
            clearable
            density="comfortable"
            hide-details
            placeholder="Search"
            prepend-inner-icon="mdi-magnify"
            style="max-width: 300px"
            variant="solo"
          />
        </v-col>
        <v-slide-y-transition>
          <v-col v-if="selectedItems.length > 0">
            <slot
              name="bulk-buttons"
              :selectedItems="selectedItems"
              :server="Object.keys(resource)[tab]"
            />
          </v-col>
        </v-slide-y-transition>
        <v-col cols="3" class="d-flex justify-end">
          <slot name="buttons" />
        </v-col>
      </v-row>
    </v-toolbar>
    <v-window v-model="tab" class="mt-5 overflow-visible">
      <v-window-item
        v-for="(server, i) in Object.keys(resource)"
        :key="i"
        :value="i"
      >
        <slot name="heading" :selectedItems="selectedItems" :server="server" />
        <v-data-iterator
          v-model:model-value="selectedItems"
          v-if="resource[server].length > 0"
          :items="resource[server] as readonly any[]"
          :search="search"
          :item-value="
            name === 'volumes' ? 'Id' : name === 'containers' ? 'name' : 'id'
          "
          :items-per-page="12"
          multiple
          show-expand
          show-select
        >
          <template #default="{ items, ...rest }">
            <v-row>
              <v-col
                v-for="(_resource, i) in items"
                :key="i"
                cols="12"
                sm="6"
                md="4"
                lg="4"
                xl="3"
              >
                <slot
                  name="card"
                  :server="server"
                  :resource="_resource"
                  v-bind="rest"
                />
              </v-col>
            </v-row>
          </template>
          <template #footer="{ page, pageCount, prevPage, nextPage }">
            <div class="d-flex align-center justify-center pa-4">
              <v-btn
                :disabled="page === 1"
                icon="mdi-arrow-left"
                density="comfortable"
                variant="tonal"
                rounded
                @click="prevPage"
              />
              <div class="mx-2 text-caption">
                Page {{ page }} of {{ pageCount }}
              </div>
              <v-btn
                :disabled="page >= pageCount"
                icon="mdi-arrow-right"
                density="comfortable"
                variant="tonal"
                rounded
                @click="nextPage"
              />
            </div>
          </template>
        </v-data-iterator>
        <div v-else>
          <v-card class="pa-3">
            <v-card-title class="text-center">
              No
              {{
                name.charAt(name.length - 1) === "s"
                  ? name.substring(0, name.length - 1)
                  : name
              }}s found
            </v-card-title>
            <v-card-text class="text-center">
              <v-icon size="100"> mdi-docker </v-icon>
              <div class="text-h6">Create a new {{ name }} to see it here.</div>
              <i
                >If there should be
                {{
                  name.charAt(name.length - 1) === "s"
                    ? name.substring(0, name.length - 1)
                    : name
                }}s on this server, check the logs for errors.</i
              >
            </v-card-text>
          </v-card>
        </div>
      </v-window-item>
    </v-window>
  </v-container>
</template>
<script setup lang="ts">
import type {
  ServerContainers,
  ServerImages,
  ServerNetworks,
  ServerVolumes,
} from "~/types/servers";
const selectedItems = ref<string[]>([]);

interface Props {
  name: "containers" | "images" | "volumes" | "networks";
  resource: ServerContainers | ServerNetworks | ServerVolumes | ServerImages;
  loading: boolean;
}
const { resource, name } = defineProps<Props>();


const tab = ref(0);
const search = ref("");
</script>
