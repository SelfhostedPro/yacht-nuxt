<template>
  <v-btn :loading="isLoading" color="primary" @click="saveFile">
    save
    <v-icon icon="mdi-content-save" />
  </v-btn>
</template>
<script setup lang="ts">
const isLoading = ref(false);
const file = useOpenProjectsFile();
const saveFile = async () => {
  isLoading.value = true;
  await $fetch("/api/projects/save", {
    method: "POST",
    body: {
      content: file.value?.content,
      path: file.value?.path,
    },
  })
    .then(() => {
      isLoading.value = false;
    })
    .catch(() => {
      isLoading.value = false;
    });
};
</script>
