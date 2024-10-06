<template>
  <containers-details
    :server="typeof server === 'string' ? server : server[0]"
    :name="typeof name === 'string' ? name : name[0]"
  />
</template>

<script lang="ts" setup>
const route = useRoute();
const { server, name } = route.params;

definePageMeta({
  layout: "default",
});
</script>

<style></style>
