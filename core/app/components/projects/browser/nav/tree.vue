<template>
  <div v-for="item in items" ref="rootitem" :key="item.path" :class="`ml-${depth || 0}`">
    <NavigationMenu v-if="item.type === 'directory'" :open.sync="isOpen[item.path]">
      <template #trigger>
        <div class="flex items-center cursor-pointer" @click="toggleOpen(item.path)"
          @contextmenu.prevent="(e: MouseEvent) => handleRightClick(item, e, path)">
          <component :is="loading.includes(item.name) ? 'Loader' : (isOpen[item.path] ? 'FolderOpen' : 'Folder')"
            class="mr-2" />
          <span class="text-gray-700">{{ item.name }}</span>
        </div>
      </template>
      <NavigationMenuContent v-if="isOpen[item.path]">
        <projects-browser-nav-tree :path="`${path}/${item.relativePath}`" :items="item.children"
          :load-children="loadChildren" :depth="depth ? 1 + depth : 1" :handle-right-click="handleRightClick"
          :set-active="setActive" />
      </NavigationMenuContent>
      <div v-else class="text-center text-gray-500">directory appears empty!</div>
    </NavigationMenu>
    <div v-else class="flex items-center cursor-pointer" @click.prevent="setActive(item)"
      @contextmenu.prevent="(e: MouseEvent) => handleRightClick(item, e, path)">
      <File class="mr-2" />
      <span class="text-gray-700">{{ item.name }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { defineProps, defineEmits } from 'vue';
import { Folder, FolderOpen, File, Loader } from 'lucide-vue-next';
import type { Dree } from 'dree';

const loading = ref<string[]>([]);
const isOpen = ref<Record<string, boolean>>({});

interface Props {
  path: string;
  items?: Dree[];
  loadChildren: (item: Dree, path: string) => Promise<void>;
  handleRightClick: (
    item: Dree,
    event: MouseEvent,
    path: string
  ) => Promise<void>;
  setActive: (item: Dree) => Promise<unknown>;
  depth?: number;
}

const { loadChildren, handleRightClick, path } = defineProps<Props>();
defineEmits(['rightClick']);

const fetchChildren = async (item: Dree, path: string) => {
  loading.value.push(item.name);
  await loadChildren(item, path);
  loading.value = loading.value.filter((name) => name !== item.name);
};

const toggleOpen = (path: string) => {
  isOpen.value[path] = !isOpen.value[path];
};
</script>
