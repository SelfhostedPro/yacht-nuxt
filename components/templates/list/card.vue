<template>
  <v-data-iterator v-if="template.templates.length > 0" :items="template.templates" :search="search"
    :items-per-page="12">
    <template #default="{ items }">
      <v-row>
        <v-col v-for="(container, i) in items" :key="i" cols="12" sm="6" md="4" lg="4" xl="3">
          <v-card class="overflow-auto" min-height="200" max-height="200">
            <v-card-item :prepend-avatar="container.raw.logo">
              <v-card-title class="d-flex align-center">
                {{ container.raw.title || container.raw.name }}
                <v-spacer />
                <v-btn class="float-right" variant="plain" @click="$emit('createApp', container.raw);" icon>
                  <v-icon icon="mdi-plus" />
                </v-btn>
                <v-btn class="float-right" variant="plain" @click="$emit('openInfo', container.raw)" icon><v-icon
                    icon="mdi-information-outline" />
                </v-btn>
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
  <div v-else>
    <v-card class="pa-3">
      <v-card-title class="text-center">
        No Templates found
      </v-card-title>
      <v-card-text class="text-center">
        <v-icon size="100">
          mdi-docker
        </v-icon>
        <div class="text-h6">
          Add a new template to see it here. <br />
          ie. https://raw.githubusercontent.com/SelfhostedPro/yacht-api/main/default_template.json
        </div>
        <i>If there should be Templates on this server, check the logs for errors.</i>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
import type { YachtTemplate } from '~/types/templates/yacht';
interface Emits {
  (e: 'createApp', app: YachtTemplate['templates'][0]): void
  (e: 'openInfo', app: YachtTemplate['templates'][0]): void
}
defineEmits<Emits>()
interface Props {
  template: YachtTemplate,
  search: string
}
defineProps<Props>()
</script>

<style></style>~/shared/templates/yacht