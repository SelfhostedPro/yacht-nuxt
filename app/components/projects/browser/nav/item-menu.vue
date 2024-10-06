<template>
  <v-card>
    <v-list>
      <v-list-item>{{ item.name }}</v-list-item>
      <v-list-item
        v-if="item.type !== 'directory'"
        @click="copyFile(item.relativePath)"
        >copy</v-list-item
      >
      <v-list-item v-if="item.type === 'directory'" @click="changeFolder(item)">
        open
      </v-list-item>
    </v-list>
  </v-card>
</template>
<script setup lang="ts">
import type { Dree } from "dree";
import type { FileInfo } from "~/types/files";
import { join } from "path";
interface Props {
  item: Dree;
  path: string;
}
const { item, path } = defineProps<Props>();
const emit = defineEmits(["closeMenu"]);

const projectsStore = useProjectsStore();
const { dir, currentPath, activeFile } = storeToRefs(projectsStore);

const copyFile = async (path: string) => {
  const fileContent = await $fetch<FileInfo>("/api/projects/file", {
    query: {
      path: `${currentPath.value}/${path}`,
    },
    cache: "no-cache",
  });
  if (!fileContent)
    throw createError(`Unable to retrieve file contents for filing.`);
  const { copy, copied } = useClipboard({ legacy: true });
  copy(fileContent.content);
};
const changeFolder = async (item: Dree) => {
  console.log(item);
  console.log(
    `going to ${join(dir.value.name, path, `/${item.relativePath}`)} from ${
      currentPath.value
    }`
  );
  projectsStore.changeDirectory(join(path, item.relativePath));
  emit("closeMenu");
  // return await navigateTo({
  //   path: "/projects",
  //   query: {
  //     path: currentPath.value.join(""),
  //     file: activeFile.value.path ? activeFile.value.path : undefined,
  //   },
  // });
};
</script>
