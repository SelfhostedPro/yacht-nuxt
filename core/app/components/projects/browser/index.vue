<template>
  <Card class="h-screen w-full">
    <div class="flex flex-col h-full">
      <div class="flex items-center justify-between p-4 border-b">
        <Button variant="ghost" @click="sidebarOpen = !sidebarOpen">
          <IconMenu />
        </Button>
        <h1 class="text-lg font-semibold">
          Project Browser - {{ activeFile.name }}
        </h1>
        <projects-browser-nav-actions-add :cwd="dir?.relativePath || ''" @added="getFolder()" />
      </div>
      <div class="flex flex-1">
        <projects-browser-nav :opened="sidebarOpen" :tree="dirTree" @to-parent="toParent" />
        <main class="flex-1">
          <projects-browser-editor />
        </main>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { join } from 'path';
import { useProjectsStore } from '#core/app/stores/projects';
import { Menu as IconMenu } from 'lucide-vue-next';

const projectsStore = useProjectsStore();
const { dir, dirTree, currentPath, activeFile, pathquery, showHidden } = storeToRefs(projectsStore);

const sidebarOpen = ref(true);
const { getFolder, changeDirectory } = projectsStore;

onMounted(async () => {
  await getFolder();

  watch([pathquery, showHidden], async () => {
    await getFolder();
  });
});

const toParent = async () => {
  console.log('changing path', `${join(currentPath.value.join(''), '..')}`);
  await changeDirectory('..');
};
</script>
