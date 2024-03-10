<template>
  <!-- <v-btn-group class="w-100 pa-2 d-flex"> -->
  <!-- <v-btn-group v-auto-animate divided class="d-flex justify-center"> -->
  <containers-actions
    :loading="loading"
    :container="container"
    :server="server"
    @start-loading="emit('startLoading')"
    @stop-loading="emit('stopLoading')"
  />
  <!-- </v-btn-group> -->
</template>

<script lang="ts" setup>
import type { Container } from "~/types/containers/yachtContainers";
defineProps<{ container: Container; server: string; loading?: boolean }>();
const emit = defineEmits(["startLoading", "stopLoading"]);
</script>

<style></style>
~/shared/containers/yachtContainers
