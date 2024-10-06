<template>
  <v-btn @click="saveFile" :loading="isLoading" color="primary">
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
    .then((res) => {
      isLoading.value = false;
    })
    .catch((e) => {
      isLoading.value = false;
    });
};
</script>
