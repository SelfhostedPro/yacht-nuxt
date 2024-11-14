<template>
  <common-list :resource="servers" name="containers" :loading="loading.includes('containers')">
    <template #bulk-buttons="{ selectedItems, server }">
      <div class="flex space-x-2">
        <Dialog
          v-for="action in actions"
          :key="action.name"
          class="flex items-center px-4 py-2 rounded-md text-white"
          :class="{
            'bg-green-500': action.color === 'success',
            'bg-yellow-500': action.color === 'warning',
            'bg-red-500': action.color === 'error',
            'bg-blue-500': action.color === 'info'
          }"
          :disabled="loading.includes('containers')"
          @click.prevent="handleBulkAction(server, selectedItems, action.name)"
        >
          <icon :name="action.icon" class="mr-2" />
          {{ action.name }}
        </Dialog>
      </div>
      <Dialog v-model="removeDialog">
        <div class="max-w-lg mx-auto p-4 bg-white rounded-md shadow-lg">
          <h3 class="font-bold">Remove Multiple Containers?</h3>
          <p>Are you sure you want to permanently remove the following containers?</p>
          <pre class="text-red-500">{{ selectedItems.join(',\n') }}</pre>
          <p>All non-persistent data will be unrecoverable.</p>
          <div class="flex justify-end space-x-2 mt-4">
            <Button class="px-4 py-2 bg-gray-300 rounded-md" @click="removeDialog = false">Cancel</Button>
            <Button
              class="px-4 py-2 bg-red-500 text-white rounded-md"
              @click.prevent="handleBulkAction(server, selectedItems, 'remove'); removeDialog = false;"
            >
              Remove
            </Button>
          </div>
        </div>
      </Dialog>
    </template>
    <template #buttons>
      <Button class="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md" @click="createDialog = true">
        <icon name="mdi-plus" />
      </Button>
      <containers-create v-if="createDialog" v-model:open="createDialog" />
      <Button
        class="flex items-center px-4 py-2 bg-gray-300 rounded-md"
        :class="{ 'opacity-60 cursor-not-allowed': loading.includes('containers') }"
        @click="refresh()"
      >
        <icon name="mdi-refresh" />
      </Button>
    </template>
    <template #card="{ server, resource, toggleSelection, isSelected }">
      <lazy-containers-list-card
        :container="resource.raw as Container"
        :server="server"
        :stats="stats[resource.raw.name] || undefined"
        :selected="isSelected(resource)"
        @selected="toggleSelection(resource)"
      />
    </template>
  </common-list>
</template>

<script lang="ts" setup>
import { ref, onMounted, nextTick } from 'vue';
import { onBeforeRouteLeave } from 'vue-router'; // Import from vue-router
import type { Container, ContainerStat, ContainerStats } from "#docker/types/containers/yachtContainers";
import { useContainersStore } from "#core/app/stores/containers";
import { fetchSSE } from '#core/app/utils/fetch';

const containersStore = useContainersStore();
const { servers, loading } = storeToRefs(containersStore);
const createDialog = ref(false);
const removeDialog = ref(false);

const { refresh: refreshList } = await containersStore.fetchContainers();
const stats = ref<ContainerStats>({});
const statsLoading = ref(false);
const statController = ref(new AbortController());

const { refresh: refreshStats, execute: getContainerStats } = useAsyncData(
  "containerStats",
  async () =>
    fetchSSE("/api/containers/stats", {
      async onopen(response) {
        if (response.ok) {
          statsLoading.value = false;
          console.log("connected to stats SSE");
        } else {
          statsLoading.value = false;
          console.log("error connecting to stats SSE", response.statusText);
        }
      },
      onmessage(ev) {
        const stat = JSON.parse(JSON.parse(ev.data)) as ContainerStat;
        stats.value[stat.name] = stat;
      },
      onclose() {
        console.log("Closed stats SSE");
        statsLoading.value = false;
      },
      onerror(err) {
        console.log("Error connecting to stats SSE");
        console.log(err);
        statsLoading.value = false;
      },
      signal: statController.value.signal,
      openWhenHidden: true,
    }),
  { server: false, immediate: false }
);

const refresh = async () => {
  statController.value.abort();
  stats.value = {};
  await refreshList();
  await refreshStats();
};

const handleBulkAction = async (
  server: string | undefined,
  items: string[],
  action: string
) => {
  if (!server) {
    console.error('Server is undefined');
    return;
  }

  if (action === "remove" && !removeDialog.value) {
    removeDialog.value = true;
    return;
  } else {
    containersStore.startLoading("containers");
    const actionPromises = items.map((item) =>
      containersStore.fetchContainerAction(server, item, action)
    );
    await Promise.all(actionPromises);
    containersStore.stopLoading("containers");
    refresh();
  }
};

onMounted(async () => {
  await nextTick();
  getContainerStats();
  statsLoading.value = false;
});

onBeforeRouteLeave(() => {
  statController.value.abort();
});

const actions = [
  {
    name: "start",
    icon: "mdi-play",
    color: "success",
    depends: ["stopped", "created", "exited"],
  },
  {
    name: "restart",
    icon: "mdi-restore",
    color: "warning",
    depends: ["running", "stopped", "created", "exited", "paused"],
  },
  {
    name: "stop",
    icon: "mdi-stop",
    color: "error",
    depends: ["running", "paused"],
  },
  {
    name: "pause",
    icon: "mdi-pause",
    color: "info",
    depends: ["running"],
  },
  {
    name: "unpause",
    icon: "mdi-play-outline",
    color: "success",
    depends: ["paused"],
  },
  {
    name: "kill",
    icon: "mdi-fire",
    color: "error",
    depends: ["all"],
  },
  {
    name: "remove",
    icon: "mdi-delete",
    color: "error",
    depends: ["all"],
  },
];
</script>
