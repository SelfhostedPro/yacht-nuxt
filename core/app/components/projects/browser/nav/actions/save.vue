<template>
  <Button :loading="isLoading" color="primary" @click="saveFile">
    save
    <Save />
  </Button>
</template>

<script setup lang="ts">
import { Save } from 'lucide-vue-next';

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
