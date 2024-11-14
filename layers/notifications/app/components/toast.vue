<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="group relative flex w-full items-center gap-4 rounded-lg border p-4 pr-8" :class="[
    breakpoints.smaller('sm') ? 'w-full' : 'w-[30vw]',
    levelClasses[level || 'info']
  ]">
    <div class="flex-shrink-0">
      <component :is="icons[level || 'info']" class="h-5 w-5" :class="levelIconClasses[level || 'info']" />
    </div>

    <div class="flex-1 space-y-1">
      <h3 v-if="title" class="font-medium leading-none tracking-tight">
        {{ title }}
      </h3>
      <p class="text-sm" :class="{ 'mt-1': title }">{{ message }}</p>
    </div>

    <button @click="$emit('closeToast')"
      class="absolute right-2 top-2 rounded-md p-1 opacity-0 transition-opacity group-hover:opacity-100"
      :class="levelIconClasses[level || 'info']">
      <span class="sr-only">Close</span>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24">
        <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M18 6L6 18M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import type { Notification, NotificationLevel } from "#notifications/types/notifications";
import {
  TriangleAlert,
  Info,
  CheckCircle,
} from 'lucide-vue-next'

defineEmits(["closeToast"]);
const breakpoints = useBreakpoints(breakpointsTailwind)

const { level, message, title } = defineProps<Notification>();

const levelClasses: Record<NotificationLevel, string> = {
  info: 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800',
  debug: 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800',
  error: 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800',
  fatal: 'bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800',
  success: 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800',
  warn: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800',
};

const levelIconClasses: Record<NotificationLevel, string> = {
  info: 'text-blue-600 dark:text-blue-400',
  debug: 'text-blue-600 dark:text-blue-400',
  error: 'text-red-600 dark:text-red-400',
  fatal: 'text-red-600 dark:text-red-400',
  success: 'text-green-600 dark:text-green-400',
  warn: 'text-yellow-600 dark:text-yellow-400',
};

const icons: Record<NotificationLevel, any> = {
  info: Info,
  debug: Info,
  error: TriangleAlert,
  fatal: TriangleAlert,
  success: CheckCircle,
  warn: TriangleAlert,
};
</script>
