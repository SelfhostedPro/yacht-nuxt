<template>
  <template
    v-if="activeFile && Object.keys(specialFileTypes).includes(activeFile.name)"
  >
    <v-btn
      v-for="action in specialFiles[specialFileTypes[activeFile.name]].actions"
      :key="action.title"
      @click="performAction(action.title)"
      :color="action.color"
    >
      {{ action.title }}
    </v-btn>
  </template>
  <v-spacer />
  <v-btn @click="saveFile" :loading="isLoading" color="primary">
    save
    <v-icon icon="mdi-content-save" />
  </v-btn>
</template>
<script setup lang="ts">
// Setup Projects Store
const projectsStore = useProjectsStore();
const { activeFile } = storeToRefs(projectsStore);

const isLoading = ref(false);

type action = { title: string; color?: string };
type SpecialFiles = { [key: string]: { actions: action[] } };

const specialFileTypes: { [name: string]: keyof SpecialFiles } = {
  "docker-compose.yml": "compose",
  "docker-compose.yaml": "compose",
  "compose.yaml": "compose",
  "compose.yml": "compose",
  "Dockerfile": "docker",
};

const specialFiles: SpecialFiles = {
  compose: {
    actions: [
      { title: "up", color: "primary" },
      { title: "down", color: "red" },
    ],
  },
  docker: {
    actions: [{ title: "build", color: "primary" }],
  },
};

// const actions: action[] = ["up", "down"];

// Action Functions
// Used to interact with API to save/bring up/down/etc.

const saveFile = async () => {
  isLoading.value = true;
  await $fetch("/api/projects/save", {
    method: "POST",
    body: {
      content: activeFile.value?.content,
      path: activeFile.value?.path,
    },
  })
    .then((res) => {
      isLoading.value = false;
    })
    .catch((e) => {
      isLoading.value = false;
    });
};

const performAction = async (action: string) => {
  await $fetch(`/api/projects/action`, {
    method: "POST",
    body: {
      action: action,
      path: activeFile.value?.path,
    },
  });
};
</script>
