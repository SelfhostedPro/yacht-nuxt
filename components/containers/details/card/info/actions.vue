<template>
  <div>
    <containers-actions :container="container" :server="server" />
  </div>
</template>

<script lang="ts" setup>
import type { Container } from '~/types/containers/yachtContainers';

interface Props {
  container: Container,
  server: string
}
defineProps<Props>()
</script>

<style></style>