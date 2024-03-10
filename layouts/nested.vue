<template>
  <DefaultLayout>
    <template #append>
      <nav-container-sidebar></nav-container-sidebar>
    </template>
    <slot />
  </DefaultLayout>
</template>

<script lang="ts" setup>
import DefaultLayout from "./default.vue";
</script>

<style></style>
