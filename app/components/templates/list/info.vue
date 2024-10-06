<template>
  <v-card v-bind="$attrs">
    <div class="d-flex align-center mt-2 pb-1 justify-center py-auto">
      <v-card-title style="position: absolute; left: 50%; transform: translateX(-50%);">{{ template.title
      }} <v-btn icon variant="plain" size="small" @click="expandedInfo = !expandedInfo"><v-icon
            :icon="expandedInfo ? 'mdi-chevron-up' : 'mdi-chevron-down'" /> </v-btn></v-card-title>
      <div class="ml-auto mr-5 d-flex">
        <p class="text-overline mr-3">created by: </p><templates-list-authors :authors="template.authors" />
      </div>
    </div>
    <v-expand-transition>
      <v-card-subtitle v-if="expandedInfo" class="bg-surface">
        name: {{ template.name }}
        <br />
        type: {{ template.type }}
        <br />
        created: {{ formatDate(template.created) }}
        <br />
        updated: {{ formatDate(template.updated) }}
        <br />
        apps: {{ template.templates.length }}
      </v-card-subtitle>
    </v-expand-transition>
    <v-card-text v-if="template.description" class="mx-auto px-auto w-50 whitespace-pre">{{
      template.description }}</v-card-text>
    <v-card-actions class="flex-d justify-center">
      <v-btn v-for="link in template['links']" :color="link.color || undefined" :key="link.text"
        :prepend-icon="link.icon || 'mdi-link'" :href="link.url || undefined" target="_blank">{{
          link.text || 'link' }}</v-btn>
      <!-- <v-btn color="info" prepend-icon="mdi-restart" @click="updateTemplate()">update</v-btn> -->
      <v-menu :close-on-content-click="false" location="top" transition="slide-y-transition" v-model="deleteMenu">
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
            <v-btn @click="deleteMenu = false">cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import { parseISO } from 'date-fns';
import type { YachtTemplate } from '~/types/templates/yacht';
const expandedInfo = ref(false)
const deleteMenu = ref(false)
const formatDate = (date: string | undefined) => {
  if (date) return parseISO(date).toLocaleString()
  else return 'unknown'
}
interface Props {
  template: YachtTemplate
}
defineProps<Props>()
</script>

<style></style>~/shared/templates/yacht