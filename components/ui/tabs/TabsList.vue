<script setup lang="ts">
import { TabsList, type TabsListProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<TabsListProps & { class?: string }>()
</script>

<template>
  <TabsList v-bind="props" :class="cn(
    'inline-flex h-10 items-center justify-center rounded-md bg-surface-container-low p-1 text-on-surface',
    props.class,
  )
    ">
    <slot />
  </TabsList>
</template>
