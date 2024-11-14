<template>
  <div class="bg-white shadow-md rounded-lg p-4">
    <ul>
      <li class="font-semibold text-lg mb-2">{{ item.name }}</li>
      <li v-if="item.type !== 'directory'" @click="copyFile(item.relativePath)"
        class="cursor-pointer text-blue-500 hover:underline flex items-center">
        <CopyIcon class="mr-2" /> Copy
      </li>
      <li v-if="item.type === 'directory'" @click="changeFolder(item)"
        class="cursor-pointer text-blue-500 hover:underline flex items-center">
        <FolderOpenIcon class="mr-2" /> Open
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { CopyIcon, FolderOpenIcon } from "lucide-vue-next";
import type { Dree } from "dree";
import type { FileInfo } from "#core/types/files";
import { useProjectsStore } from "#core/app/stores/projects";
import { join } from "path";

interface Props {
  item: Dree;
  path: string;
}

const { item, path } = defineProps<Props>();
const emit = defineEmits(["closeMenu"]);

const projectsStore = useProjectsStore();
const { dir, currentPath } = storeToRefs(projectsStore);

const copyFile = async (path: string) => {
  const fileContent = await $fetch<FileInfo>("/api/projects/file", {
    query: {
      path: `${currentPath.value}/${path}`,
    },
    cache: "no-cache",
  });
  if (!fileContent)
    throw createError(`Unable to retrieve file contents for filing.`);
  const { copy } = useClipboard({ legacy: true });
  copy(fileContent.content);
};

const changeFolder = async (item: Dree) => {
  console.log(item);
  console.log(
    `going to ${join(dir.value.name, path, `/${item.relativePath}`)} from ${currentPath.value
    }`
  );
  projectsStore.changeDirectory(join(path, item.relativePath));
  emit("closeMenu");
};
</script>
