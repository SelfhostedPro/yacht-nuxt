<template>
  <v-navigation-drawer color="foreground" :model-value="opened" permanent>
    <v-toolbar elevation="3" color="primary">
      <v-toolbar-title class="align-center">
        <v-icon icon="mdi-folder" size="22" class="me-1 pb-1" />
        {{ currentPath.join("") || "/data" }}
      </v-toolbar-title>
    </v-toolbar>
    <v-toolbar density="compact">
      <v-btn @click="$emit('toParent')" icon="mdi-chevron-double-up" />
      <v-btn
        size="small"
        :icon="showHidden ? 'mdi-eye' : 'mdi-eye-off'"
        @click="showHidden = !showHidden"
      />
      <!-- <v-btn size="small" :icon="''" @click="''" /> -->
    </v-toolbar>
    <v-progress-linear v-if="loading.includes('tree')" indeterminate />
    <v-list v-model:opened="openedTree" density="compact">
      <projects-browser-nav-tree
        v-if="dirTree && dirTree.length > 0"
        path=""
        :items="dirTree"
        :setActive="(item) => projectsStore.setActiveFile(item.path)"
        :load-children="getChildren"
        :handleRightClick="handleRightClick"
      />
      <v-card-text class="text-center" v-else>No files found in data directory.</v-card-text>
    </v-list>
    <v-menu
      v-model:model-value="menu.open"
      :target="[menu.chords.x, menu.chords.y]"
      location="right"
      :open-on-click="false"
      :close-on-content-click="false"
      location-strategy="connected"
    >
      <projects-browser-nav-item-menu
        v-if="menu.item && menu.item.path"
        :item="menu.item"
        :path="menu.item.path"
        @close-menu="
          menu.open = false;
          menu.item = undefined;
          menu.path = '';
        "
      />
    </v-menu>
  </v-navigation-drawer>
</template>
<script setup lang="ts">
import type { Dree } from "dree";
const menu = ref<{
  item?: Dree;
  path?: string;
  open: boolean;
  chords: { x: number; y: number };
}>({ open: false, chords: { x: 0, y: 0 } });

const openedTree = ref<string[]>([]);

const projectsStore = useProjectsStore();
const { getChildren } = projectsStore;
const { currentPath, dir, dirTree, loading, showHidden, filter } =
  storeToRefs(projectsStore);

interface Props {
  opened?: boolean;
}
defineProps<Props>();
defineEmits(["toParent"]);

const handleRightClick = async (
  item: Dree,
  event: MouseEvent,
  path: string
) => {
  menu.value = {
    open: true,
    item: item,
    path: path,
    chords: { x: event.pageX, y: event.pageY },
  };
};
</script>
