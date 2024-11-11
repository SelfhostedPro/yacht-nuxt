<template>
  <template
    v-if="activeFile && Object.keys(specialFileTypes).includes(activeFile.name)"
  >
    <v-btn
      v-for="actionItem in getFileActions()"
      :key="actionItem.title"
      :color="actionItem.color"
      @click="performAction(actionItem.title)"
    >
      {{ actionItem.title }}
    </v-btn>
  </template>
  <v-spacer />
  <v-btn :loading="isLoading" color="primary" @click="saveFile">
    save
    <v-icon icon="mdi-content-save" />
  </v-btn>
</template>

<script setup lang="ts">
import { useProjectsStore } from "#core/app/stores/projects";
// Setup Projects Store
const projectsStore = useProjectsStore();
const { activeFile } = storeToRefs(projectsStore);

const isLoading = ref(false);

interface Action {
  title: string;
  color?: string;
}

interface SpecialFiles {
  compose: { actions: Action[] };
  docker: { actions: Action[] };
}

const specialFileTypes: Record<string, keyof SpecialFiles> = {
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

const getFileActions = (): Action[] => {
  if (!activeFile.value?.name) return [];
  const fileType = specialFileTypes[activeFile.value.name];
  return fileType ? specialFiles[fileType].actions : [];
};

// Action Functions
const saveFile = async () => {
  isLoading.value = true;
  try {
    await $fetch("/api/projects/save", {
      method: "POST",
      body: {
        content: activeFile.value?.content,
        path: activeFile.value?.path,
      },
    });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_error) {
    // Error handling could be added here
  } finally {
    isLoading.value = false;
  }
};

const performAction = async (action: string) => {
  await $fetch(`/api/projects/action`, {
    method: "POST",
    body: {
      action,
      path: activeFile.value?.path,
    },
  });
};
</script>
