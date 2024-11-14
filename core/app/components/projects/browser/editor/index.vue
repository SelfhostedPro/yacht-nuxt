<template>
  <div class="fill-height">
    <NavigationMenu v-if="activeFile.name">
      <NavigationMenuList class="w-100 d-flex justify-space-between">
        <projects-browser-editor-actions />
        <!-- Add any additional shadcn-vue components here if needed -->
      </NavigationMenuList>
    </NavigationMenu>
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
import type { FileInfo } from "#core/types/files";
import { useProjectsStore } from "#core/app/stores/projects";
import {
  NavigationMenu,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';

const fullscreen = ref(false);
const language = ref<string>("plaintext");

const projectsStore = useProjectsStore();
const { activeFile } = storeToRefs(projectsStore);
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
    ? extensionMap[activeFile.extension] || 'plaintext'
    : activeFile?.name
    ? fileMap[activeFile.name] || 'plaintext'
    : 'plaintext';
  editableFile.value = Object.assign(activeFile);
});
</script>
