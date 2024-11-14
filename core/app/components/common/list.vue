<template>
  <div class="container mx-auto p-4">
    <div class="flex justify-center space-x-4">
      <div
        v-for="(server, i) in Object.keys(resource)"
        :key="i"
        class="px-4 py-2 cursor-pointer"
        :class="{ 'font-bold': tab === i }"
        @click="tab = i"
      >
        {{ server }}
      </div>
    </div>
    <div class="flex justify-between items-center py-2">
      <input
        v-model="search"
        type="text"
        placeholder="Search"
        class="px-2 py-1 border border-gray-300 rounded"
      />
      <div v-if="selectedItems.length > 0">
        <slot
          name="bulk-buttons"
          :selectedItems="selectedItems"
          :server="Object.keys(resource)[tab]"
        />
      </div>
      <div>
        <slot name="buttons" />
      </div>
    </div>
    <div class="mt-5">
      <div v-for="(server, i) in Object.keys(resource)" :key="i" v-show="tab === i">
        <slot name="heading" :selectedItems="selectedItems" :server="server" />
        <div v-if="resource[server]?.length && resource[server]!.length > 0">
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div
              v-for="(_resource, i) in filteredItems(resource[server] || [])"
              :key="i"
              @click="toggleSelection(_resource)"
              class="p-4 border border-gray-300 rounded cursor-pointer"
              :class="{ 'border-blue-500': isSelected(_resource) }"
            >
              <slot
                name="card"
                :server="server"
                :resource="_resource"
                :toggleSelection="toggleSelection"
                :isSelected="isSelected"
              />
            </div>
          </div>
          <div class="flex justify-center items-center mt-4">
            <button class="px-4 py-2 mx-2" @click="prevPage" :disabled="page === 1">Previous</button>
            <span class="mx-2">Page {{ page }} of {{ pageCount }}</span>
            <button class="px-4 py-2 mx-2" @click="nextPage" :disabled="page >= pageCount">Next</button>
          </div>
        </div>
        <div v-else>
          <div class="p-4 border border-gray-300 rounded">
            <h2 class="text-center">No {{ singularName }}s found</h2>
            <p class="text-center">
              <i>If there should be {{ singularName }}s on this server, check the logs for errors.</i>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Props {
  name: "containers" | "images" | "volumes" | "networks";
  resource: Record<string, any[]>;
  loading: boolean;
}

const { resource, name } = defineProps<Props>();
const tab = ref(0);
const search = ref("");
const selectedItems = ref<any[]>([]);
const itemsPerPage = 12;
const page = ref(1);

const filteredItems = (items: any[]) => {
  return items.filter(item => {
    const value = name === 'volumes' ? item.Id : name === 'containers' ? item.name : item.id;
    return value.toLowerCase().includes(search.value.toLowerCase());
  });
};

const pageCount = computed(() => {
  const currentServer = Object.keys(resource)[tab.value];
  const currentResource = currentServer ? resource[currentServer] || [] : [];
  return Math.ceil(filteredItems(currentResource).length / itemsPerPage);
});

const toggleSelection = (item: any) => {
  const itemId = name === 'volumes' ? item.Id : name === 'containers' ? item.name : item.id;
  const index = selectedItems.value.findIndex(selected => selected === itemId);
  if (index === -1) {
    selectedItems.value.push(itemId);
  } else {
    selectedItems.value.splice(index, 1);
  }
};

const isSelected = (item: any) => {
  const itemId = name === 'volumes' ? item.Id : name === 'containers' ? item.name : item.id;
  return selectedItems.value.includes(itemId);
};

const prevPage = () => {
  if (page.value > 1) page.value--;
};

const nextPage = () => {
  if (page.value < pageCount.value) page.value++;
};

const singularName = computed
