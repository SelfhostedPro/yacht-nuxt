<script setup lang="ts">
import { useBreakpoints, breakpointsTailwind } from '@vueuse/core'
// import ResourceList from '#ui/app/components/nav/ResourceList.vue'

const breakpoints = useBreakpoints(breakpointsTailwind)
const isDesktop = breakpoints.greater('lg')
</script>

<template>
    <Sidebar v-if="isDesktop" collapsible="none" class="flex overflow-hidden [&>[data-sidebar=sidebar]]:flex-row border-r">
        <slot />
    </Sidebar>
</template>
