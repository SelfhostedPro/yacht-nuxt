<template>
  <v-card-item class="d-flex flex-column items-center overflow-auto px-5">
    <pre>
      {{ formatContainer(container) }}
    </pre>
  </v-card-item>
</template>

<script lang="ts" setup>
import type { Container } from '~/types/containers/yachtContainers';
const props = defineProps<{ container: Container }>()

const formatContainer = (container: Container) => {
  return JSON.stringify(container, null, 2)
}
</script>

<style></style>