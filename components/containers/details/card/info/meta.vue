<template>
  <v-card-title v-if="info.title" tag="span">{{ info.title }}
      <v-btn v-if="info.url" size="small" icon target="_blank" variant="plain" :href="info.url">
          <v-icon icon="mdi-open-in-new" />
      </v-btn>
      <v-btn v-if="info.docs" size="small" icon target="_blank" variant="plain" :href="info.docs">
          <v-icon icon="mdi-file-document" />
      </v-btn>
      <v-btn v-if="info.source" size="small" icon target="_blank" variant="plain" :href="info.source">
          <v-icon icon="mdi-github" />
      </v-btn>
  </v-card-title>
  <v-card-subtitle v-if="info.vendor" tag="span" class="mt-0">created by: {{ info.vendor
  }}</v-card-subtitle>
  <v-card-text v-if="info.notes" v-html="$mdRenderer.render(info?.notes)" />
  <v-card-text v-if="info.description" v-html="$mdRenderer.render(info?.description)" />
</template>

<script lang="ts" setup>
import type { Container } from '~/types/containers/yachtContainers';

interface Props {
  info: Container['info']
}
defineProps<Props>();

</script>

<style>

</style>