<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-medium">Base</h3>
    </div>

    <Card>
      <CardContent class="space-y-4">
        <div 
          v-for="(field, i) in base" 
          :key="i"
          class="w-full"
        >
          <common-form-dynamic-string 
            :field="{
              ...field,
              type: field.type === 'select' ? 'select' : 'input'
            }" 
          />
        </div>
      </CardContent>
    </Card>
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
    { 
      label: 'Name',
      name: 'name', 
      value: 'name', 
      placeholder: 'yacht', 
      type: 'input'
    },
    { 
      label: 'Image',
      name: 'image', 
      value: 'image', 
      placeholder: 'ghcr.io/selfhostedpro/yacht-api:main', 
      type: 'input'
    },
    { 
      label: 'Restart',
      name: 'restart', 
      value: 'restart', 
      items: ['always', 'on-failure', 'unless-stopped', 'none'], 
      type: 'select'
    },
    { 
      label: 'Server',
      name: 'server', 
      value: 'server', 
      items: Object.keys(servers.value), 
      type: 'select'
    }
  ]
})
</script>
