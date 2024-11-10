<template>
  <div
    v-for="item in items"
    ref="rootitem"
    :key="item.path"
    :class="`mx-${depth || 0}`"
  >
    <v-list-group
      v-if="item.type === 'directory'"
      subgroup
      fluid
      :value="item.path"
    >
      <template #activator="{ isOpen, props }">
        <v-list-item
          v-bind="props"
          :title="item.name"
          @contextmenu.prevent="(e: MouseEvent) => handleRightClick(item, e, path)"
          @click="
            (e) => {
              item.children && item.children.length === 0
                ? fetchChildren(item, path)
                : null;
            }
          "
        >
          <template #prepend="{}">
            <v-icon v-if="loading.includes(item.name)" icon="$loading" />
            <v-icon v-else-if="isOpen" icon="mdi-folder-open" />
            <v-icon v-else icon="mdi-folder" />
          </template>
          <!-- <template #append="{}">
            <v-icon @click="" icon="mdi-refresh"></v-icon>
          </template> -->
        </v-list-item>
      </template>
      <projects-browser-nav-tree
        v-if="item.children && item.children.length > 0"
        :path="`${path}/${item.relativePath}`"
        :items="item.children"
        :load-children="loadChildren"
        :depth="depth ? 1 + depth : 1"
        :handle-right-click="handleRightClick"
        :set-active="setActive"
      />
      <v-card-text v-else class="text-center"
        >directory appears empty!</v-card-text
      >
    </v-list-group>
    <v-list-item
      v-else
      :title="item.name"
      prepend-icon="mdi-file"
      @click.prevent="setActive(item)"
      @contextmenu.prevent="(e: MouseEvent) => handleRightClick(item, e, path)"
    />
  </div>
</template>

<script setup lang="ts">
import type { Dree } from "dree";
const loading = ref<string[]>([]);
interface Props {
  path: string;
  items: Dree[];
  loadChildren: (item: Dree, path: string) => Promise<void>;
  handleRightClick: (
    item: Dree,
    event: MouseEvent,
    path: string
  ) => Promise<void>;
  setActive: (item: Dree) => Promise<any>;
  depth?: number;
}
const { loadChildren, handleRightClick, path } = defineProps<Props>();

const emit = defineEmits(["rightClick"]);
const fetchChildren = async (item: Dree, path: string) => {
  loading.value.push(item.name);
  await loadChildren(item, path);
  loading.value = loading.value.filter((name) => name !== item.name);
};
</script>
