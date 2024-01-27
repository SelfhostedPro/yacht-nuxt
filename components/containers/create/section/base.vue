<template>
  <div>
    <v-card-title>
      Base Info
    </v-card-title>
    <v-card-text>
      <containers-create-section-dynamic-string v-for="field, i in fields" :key="i" :field="field" />
    </v-card-text>
  </div>
</template>

<script lang="ts" setup>
import type { Field } from './dynamic-string.vue'
const { servers } = useContainersStore()

const fields: Field[] = [
  { label: 'Name', value: 'name', placeholder: 'yacht', type: 'VTextField' },
  { label: 'Image', value: 'image', placeholder: 'ghcr.io/selfhostedpro/yacht-api:main', type: 'VTextField' },
  { label: 'Restart', value: 'restart', items: ['always', 'on-failure', 'unless-stopped', 'none'], type: 'VSelect' },
  { label: 'Server', value: 'server', items: Object.keys(servers), type: 'VSelect' }
]
</script>

<style></style>