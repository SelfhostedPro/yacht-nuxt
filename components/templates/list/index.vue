<template>
  <!-- <div>
    {{ templates }}
  </div> -->
  <v-container fluid class="px-0">
    <v-tabs v-model="tab" bg-color="surface" color="primry" align-tabs="center">
      <v-tab v-for="template, i in templates" :key="i" :value="i">
        {{ template.name }}
      </v-tab>
    </v-tabs>
    <v-toolbar class="px-2">
      <v-row justify="space-between">
        <v-col>
          <v-text-field v-model="search" clearable density="comfortable" hide-details placeholder="Search"
            prepend-inner-icon="mdi-magnify" style="max-width: 300px;" variant="solo" />
        </v-col>
        <v-col cols="3" class="d-flex justify-end">
          <templates-list-add />
          <v-btn icon :loading="loading.includes('containers')" @click="">
            <v-icon>mdi-refresh</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-toolbar>
    <v-window v-model="tab">
      <v-window-item v-for="template, i in templates" :key="i" :value="i">
        <v-row dense>
          <v-col class="text-center">
            <v-fade-transition>
              <v-card v-if="search.length < 1">
                <v-card-title>{{ template.title }}</v-card-title>
                <v-card-text v-if="template.description" class="text-high-emphasis px-12"
                  style="white-space: pre-wrap;">{{ template.description }}</v-card-text>
                <v-card-subtitle>name: {{ template.name }}</v-card-subtitle>
                <v-card-subtitle>type: {{ template.type }}</v-card-subtitle>
                <v-card-subtitle>created: {{ formatDate(template.created) }}</v-card-subtitle>
                <v-card-subtitle v-if="template.updated">updated: {{ formatDate(template.updated)
                }}</v-card-subtitle>
                <v-card-subtitle>apps: {{ template.templates.length }}</v-card-subtitle>
                <v-card-actions class="flex-d justify-center">
                  <v-btn v-for="link in template['links']" :color="link.color || undefined" :key="link.text"
                    :prepend-icon="link.icon || 'mdi-link'" :href="link.url || undefined" target="_blank">{{
                      link.text || 'link' }}</v-btn>
                  <!-- <v-btn color="info" prepend-icon="mdi-restart" @click="updateTemplate()">update</v-btn> -->
                  <v-menu :close-on-content-click="false" location="top" transition="slide-y-transition">
                    <template v-slot:activator="{ props }">
                      <v-btn v-bind="props" color="error" prepend-icon="mdi-delete">delete</v-btn>
                    </template>
                    <v-card :title="`delete template ${template.name}?`" max-width="30vw">
                      <v-card-text>
                        This action cannot be undone. <br />
                        Apps deployed with this template will continue to run on your system.<br />
                      </v-card-text>
                      <v-card-actions>
                        <!-- <v-btn @click="deleteTemplate(); deleteMenu = false" color="error">confirm</v-btn> -->
                        <!-- <v-btn @click="deleteMenu = false">cancel</v-btn> -->
                      </v-card-actions>
                    </v-card>
                  </v-menu>
                </v-card-actions>
              </v-card>
            </v-fade-transition>
          </v-col>
        </v-row>
        <templates-list-carousel v-if="search.length < 1 && template.featured" :template="template" />
        <v-data-iterator v-if="templates.length > 0" :items="Array.from(template.templates)" :search="search"
          :items-per-page="12">
          <template #default="{ items }">
            <v-row>
              <v-col v-for="(container, i) in items" :key="container.raw.id" cols="12" sm="6" md="4" lg="4" xl="3">
                <v-card class="overflow-auto" min-height="200" max-height="200">
                  <v-card-item :prepend-avatar="container.raw.logo">
                    <v-card-title>
                      {{ container.raw.title || container.raw.name }}
                    </v-card-title>
                    <v-card-subtitle>
                      {{ container.raw.image }}
                    </v-card-subtitle>
                  </v-card-item>
                  <v-card-text>{{ container.raw.description || `${container.raw.title || container.raw.name} doesn't
                    provide a
                    description.`}}</v-card-text>
                </v-card>
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
      </v-window-item>
    </v-window>
    <!---
    <v-window v-model="tab" class="mt-5">
      <v-window-item v-for="server, i in Object.keys(resource)" :key="i" :value="i">
        <v-data-iterator v-if="resource[server].length > 0" :items="resource[server]" :search="search"
          :items-per-page="12">
          <template #default="{ items }">
            <v-row>
              <v-col v-for="_resource, i in items" :key="i" cols="12" sm="6" md="4" lg="4" xl="3">

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
    {{ JSON.stringify(resource) }}-->
  </v-container>
</template>
<script setup lang="ts">
import { parseISO } from 'date-fns';
import type { YachtTemplate } from '~/types/templates/yacht';


const templatesStore = useTemplatesStore()
const { loading, templates } = storeToRefs(templatesStore)
const tab = ref(0)
const search = ref('')
const notifications = notificationsConnected()
const selectedApp = ref<YachtTemplate | null>(null)
const openDialog = ref(false)

const formatDate = (date: string | undefined) => {
  if (date) return parseISO(date).toLocaleString()
  else return 'unknown'
}

// const Cards = {
//   images: markRaw(ResourcesListImageCard),
//   networks: markRaw(ResourcesListNetworkCard),
//   volumes: markRaw(ResourcesListVolumeCard),
// }

const refresh = async () => {
  await until(notifications).toBe(true)
  await useAsyncData('templateList', () => templatesStore.fetchTemplates(), {
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