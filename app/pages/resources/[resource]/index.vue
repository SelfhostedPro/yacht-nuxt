<template>
  <resources-list :name="resource"></resources-list>
</template>

<script setup lang="ts">
const route = useRoute();
const resource =
  route.params.resource === "networks"
    ? "networks"
    : route.params.resource === "volumes"
    ? "volumes"
    : "images";
definePageMeta({
  validate: (route) => {
    return (
      route.params.resource === "networks" ||
      route.params.resource === "volumes" ||
      route.params.resource === "images"
    );
  },
});
</script>
