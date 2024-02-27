<template>
  <v-card-title v-if="info.title" tag="span">{{ info.title }}
    <v-tooltip location="bottom" v-for="link, i in links" :key="i" :text="link?.text">
      <template #activator="{ props: props }">
        <v-btn v-if="link?.url" size="small" icon target="_blank" variant="plain" :href="link.url" v-bind="props">
          <v-icon :icon="link?.icon" />
        </v-btn>
      </template>
    </v-tooltip>
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
const { info } = defineProps<Props>();

const links = [
  info.url ? { text: 'website', icon: 'mdi-open-in-new', url: info.url } : null,
  info.docs ? { text: 'documentation', icon: 'mdi-file-document', url: info.docs } : null,
  info.source ? { text: 'source', icon: 'mdi-github', url: info.source } : null,
]

</script>

<style></style>~/shared/containers/yachtContainers