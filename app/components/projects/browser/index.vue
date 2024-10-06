<template>
  <v-card height="100vh" width="100%">
    <v-layout :fullHeight="true">
      <v-app-bar>
        <template #prepend>
          <v-app-bar-nav-icon @click="sidebarOpen = !sidebarOpen" />
        </template>
        <v-toolbar-title class="d-flex">
          Project Browser - {{ activeFile.name }}
        </v-toolbar-title>
        <template #append>
          <projects-browser-nav-actions-add
            @added="getFolder()"
            :cwd="dir?.relativePath || ''"
          />
        </template>
      </v-app-bar>
      <projects-browser-nav
        :opened="sidebarOpen"
        @to-parent="toParent"
        :tree="dirTree"
      ></projects-browser-nav>
      <v-main class="fill-height">
        <projects-browser-editor />
      </v-main>
    </v-layout>
  </v-card>
</template>
<script setup lang="ts">
import { join } from "path";
// import { useNotificationsStore } from "@labvue/core/stores/notificationsStore";
// import type { Dree } from "dree";
const projectsStore = useProjectsStore();
const { dir, dirTree, currentPath, activeFile, pathquery, showHidden } =
  storeToRefs(projectsStore);

const sidebarOpen = ref(true);
const { getFolder, changeDirectory } = projectsStore;

onMounted(async () => {
  await getFolder();

  watch([pathquery, showHidden], async () => {
    await getFolder();
  });
});

const toParent = async () => {
  console.log("changing path", `${join(currentPath.value.join(""), "..")}`);
  await changeDirectory("..");
};
</script>
