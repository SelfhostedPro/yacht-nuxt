<script setup lang="ts">
import { MenubarSubTrigger, type MenubarSubTriggerProps } from 'radix-vue'
import { ChevronRight } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

const props = defineProps<MenubarSubTriggerProps & { inset?: boolean; class?: string }>()
</script>

<template>
  <MenubarSubTrigger
    v-bind="props"
    :class="[
      cn(
        'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-tertiary focus:text-on-tertiary data-[state=open]:bg-tertiary data-[state=open]:text-on-tertiary',
        inset && 'pl-8',
        props.class,
      ),
    ]"
  >
    <slot />
    <ChevronRight class="ml-auto h-4 w-4" />
  </MenubarSubTrigger>
</template>
