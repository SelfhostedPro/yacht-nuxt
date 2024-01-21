<script setup lang="ts">
import { cn } from '@/lib/utils'

const props = defineProps({
  class: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <div
    :class="
      cn(
        'rounded-lg border border-outline-variant bg-surface-container-low text-on-surface shadow-sm',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>
