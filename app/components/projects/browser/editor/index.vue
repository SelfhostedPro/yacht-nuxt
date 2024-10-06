<template>
  <div class="fill-height">
    <v-slide-y-transition>
      <v-toolbar v-if="activeFile.name" density="compact">
        <v-toolbar-items class="w-100 d-flex justify-space-between">
          <projects-browser-editor-actions />
          <!-- <v-btn
            icon="mdi-arrow-expand-all"
            @click="fullscreen = !fullscreen"
          ></v-btn> -->
        </v-toolbar-items>
      </v-toolbar>
    </v-slide-y-transition>
    <MonacoEditor
      v-if="editableFile && editableFile.content"
      v-model="activeFile.content"
      :options="{ theme: 'vs-dark', minimap: { enabled: false } }"
      class="fill-height"
      :lang="language"
    />
  </div>
</template>

<script setup lang="ts">
import type { FileInfo } from "~/types/files";
const fullscreen = ref(false);
const language = ref<string>("plaintext");

const projectsStore = useProjectsStore();
const { activeFile, currentPath } = storeToRefs(projectsStore);
const editableFile = ref<FileInfo>();
defineEmits(["toParent"])
const extensionMap: { [key: string]: string } = {
  ".yaml": "yaml",
  ".yml": "yaml",
  ".ts": "typescript",
  ".md": "markdown",
  ".py": "python",
  ".sh": "shell",
};
const fileMap: { [key: string]: string } = {
  Dockerfile: "dockerfile",
};

watch(fullscreen, (isFullscreen) => {
  setPageLayout(isFullscreen ? false : "default");
});

watch(activeFile, (activeFile) => {
  language.value = activeFile?.extension
    ? extensionMap[activeFile.extension]
    : activeFile?.name
    ? fileMap[activeFile.name]
    : "plaintext";
  editableFile.value = Object.assign(activeFile);
});
</script>
