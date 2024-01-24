<template>
  <v-card
    flat
    rounded="0"
    class="mx-auto my-auto"
  >
    <v-card-title>
      Basic Info
    </v-card-title>
    <v-card-text>
      <containers-create-section-dynamic
        v-for="field, i in fields"
        :key="i"
        :field="field"
      />
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import type {Field} from './dynamic.vue'
const { servers } = useContainersStore()

const fields: Field[] = [ 
  {  label: 'Name', value: 'name', placeholder: 'yacht', type: 'VTextField' },
  { label: 'Image', value: 'image', placeholder: 'ghcr.io/selfhostedpro/yacht-api:main', type: 'VTextField'},
  { label: 'Restart', value: 'restart', items: ['always', 'on-failure', 'unless-stopped', 'none'], type: 'VSelect'},
  { label: 'Server', value: 'server', items: Object.keys(servers), type: 'VSelect' }
]
</script>

<style>

</style>