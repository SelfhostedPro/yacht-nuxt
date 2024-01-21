<script setup lang="ts">
import { MenubarTrigger, type MenubarTriggerProps } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<MenubarTriggerProps & { class?: string }>()
</script>

<template>
  <MenubarTrigger
    v-bind="props"
    :class="
      cn(
        'flex cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none focus:bg-tertiary focus:text-on-tertiary data-[state=open]:bg-tertiary data-[state=open]:text-on-tertiary',
        props.class,
      )
    "
  >
    <slot />
  </MenubarTrigger>
</template>
