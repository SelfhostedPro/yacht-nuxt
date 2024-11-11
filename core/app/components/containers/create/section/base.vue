<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <v-card-title>
      base
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col v-for="field, i in base" :key="i" cols="12">
          <common-form-dynamic-string :field="field" />
        </v-col>
      </v-row>
    </v-card-text>
  </div>
</template>

<script lang="ts" setup>
import type { Field } from '#core/types/forms'
import { useContainersStore } from '#core/app/stores/containers'

const containerStore = useContainersStore()
const { servers } = storeToRefs(containerStore)
await useAsyncData('servers', () => containerStore.fetchContainers().then(() => true))


const base: ComputedRef<Field[]> = computed(() => {
  return [
    { label: 'Name', value: 'name', placeholder: 'yacht', type: 'VTextField' },
    { label: 'Image', value: 'image', placeholder: 'ghcr.io/selfhostedpro/yacht-api:main', type: 'VTextField' },
    { label: 'Restart', value: 'restart', items: ['always', 'on-failure', 'unless-stopped', 'none'], type: 'VSelect' },
    { label: 'Server', value: 'server', items: Object.keys(servers.value), type: 'VSelect' }
  ]
})
</script>

<style></style>~/shared/forms