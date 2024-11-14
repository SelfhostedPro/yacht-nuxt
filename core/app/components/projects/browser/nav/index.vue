<template>
  <Drawer open={opened} class="bg-foreground">
    <DrawerHeader class="bg-primary shadow-md">
      <DrawerTitle class="flex items-center justify-center">
        <FolderIcon class="w-5 h-5 mr-1 pb-1" />
        {{ currentPath.join("") || "/data" }}
      </DrawerTitle>
    </DrawerHeader>
    <DrawerFooter class="flex justify-between p-2">
      <Button @click="$emit('toParent')" class="flex items-center">
        <ChevronsUp class="w-5 h-5" />
      </Button>
      <Button @click="showHidden = !showHidden" class="flex items-center">
        <component :is="showHidden ? EyeIcon : EyeOffIcon" class="w-5 h-5" />
      </Button>
    </DrawerFooter>
    <ProgressLinear v-if="loading.includes('tree')" indeterminate class="h-1" />
    <List class="flex-1 overflow-y-auto">
      <projects-browser-nav-tree
        v-if="dirTree && dirTree.length > 0"
        path=""
        :items="dirTree"
        :set-active="(item) => projectsStore.setActiveFile(item.path)"
        :load-children="getChildren"
        :handle-right-click="handleRightClick"
      />
      <CardText v-else class="text-center">No files found in data directory.</CardText>
    </List>
    <Menu v-model:model-value="menu.open" :target="[menu.chords.x, menu.chords.y]" location="right" :open-on-click="false" :close-on-content-click="false" location-strategy="connected">
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
    </Menu>
  </Drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useProjectsStore } from "#core/app/stores/projects";
import { FolderIcon, ChevronsUp, EyeIcon, EyeOffIcon } from 'lucide-vue-next';
import type { Dree } from 'dree';

const menu = ref<{
  item?: Dree;
  path?: string;
  open: boolean;
  chords: { x: number; y: number };
}>({ open: false, chords: { x: 0, y: 0 } });

const projectsStore = useProjectsStore();
const { getChildren } = projectsStore;
const { currentPath, dirTree, loading, showHidden } = storeToRefs(projectsStore);

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
