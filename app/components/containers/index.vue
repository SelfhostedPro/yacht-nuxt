<template>
  <common-list :resource="servers" name="containers" :loading="isContainersLoading">
    <template #bulk-buttons="{ selectedItems, server }">
      <v-btn-group>
        <v-tooltip v-for="action in filteredActions" :key="action.name" :text="action.name" location="bottom">
          <template #activator="{ props: props }">
            <v-btn v-bind="props" :color="action.color" class="my-1" :disabled="isContainersLoading" @click.prevent="
              handleBulkAction(server!, selectedItems, action.name)
              ">
              <v-icon :icon="action.icon" />
            </v-btn>
          </template>
        </v-tooltip>
        <v-dialog v-model="dialogs.remove">
          <v-card width="40vw" class="mx-auto">
            <v-row no-gutters>
              <v-col>
                <v-card-title class="text-no-wrap mt-3 ml-5">
                  remove <b class="text-error">multiple containers</b>?
                </v-card-title>
              </v-col>
              <v-col cols="1">
                <v-btn :rounded="0" variant="plain" icon @click="dialogs.remove = false">
                  <v-icon icon="mdi-window-close" />
                </v-btn>
              </v-col>
            </v-row>
            <v-card-text>
              Are you sure you want to permanently remove the following
              containers? <br />
              <pre
                class="text-error text-capitalize"><b>{{ selectedItems.map((item: string) => item).join(',\n') }}</b></pre>
              All non-peristent data will be unrecoverable.
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn @click.prevent="dialogs.remove = false"> Cancel </v-btn>
              <v-btn color="error" @click.prevent="
                handleBulkAction(server!, selectedItems, 'remove');
              dialogs.remove = false;
              ">
                Remove
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-btn-group>
    </template>
    <template #buttons>
      <v-btn icon color="primary" @click="dialogs.create = true">
        <v-icon icon="mdi-plus" />
      </v-btn>
      <containers-create v-if="dialogs.create" v-model:open="dialogs.create" />
      <v-btn icon :loading="isContainersLoading" @click="refresh()">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </template>
    <template #card="{ server, resource, toggleSelect, isSelected }">
      <lazy-containers-list-card :container="(resource.raw as Container)" :server="server"
        :stats="stats[resource.raw.name] ? stats[resource.raw.name] : undefined" :selected="isSelected(resource)"
        @selected="toggleSelect(resource)" />
    </template>
  </common-list>
</template>

<script lang="ts" setup>
import type {
  Container,
  ContainerStat,
  ContainerStats,
} from "~~/types/containers/yachtContainers";

const containersStore = useContainersStore();
const { servers, loading } = storeToRefs(containersStore);

const dialogs = reactive({
  create: false,
  remove: false,
});

const stats = shallowRef<ContainerStats>({});
const statsLoading = ref(false);
const statController = shallowRef(new AbortController());

const isContainersLoading = computed(() => loading.value.includes('containers'));

const { refresh: refreshList } = await containersStore.fetchContainers();

const { refresh: refreshStats, execute: getContainerStats } = useAsyncData(
  "containerStats",
  async () => fetchContainerStats(),
  { server: false, immediate: false }
);

const fetchContainerStats = () =>
  fetchSSE("/api/containers/stats", {
    async onopen(response) {
      statsLoading.value = response.ok;
      console.log(response.ok ? "Connected to stats SSE" : "Error connecting to stats SSE", response.statusText);
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
      console.error("Error connecting to stats SSE:", err);
      statsLoading.value = false;
    },
    signal: statController.value.signal,
    openWhenHidden: true,
  });

const refresh = async () => {
  statController.value.abort();
  statController.value = new AbortController();
  stats.value = {};
  await Promise.all([refreshList(), refreshStats()]);
};

const handleBulkAction = async (server: string, items: string[], action: string) => {
  if (action === "remove" && !dialogs.remove) {
    dialogs.remove = true;
    return;
  }

  containersStore.startLoading("containers");
  try {
    await Promise.all(items.map(item =>
      containersStore.fetchContainerAction(server, item, action)
    ));
    await refresh();
  } catch (error) {
    console.error(`Error performing bulk action ${action}:`, error);
  } finally {
    containersStore.stopLoading("containers");
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
  { name: "start", icon: "mdi-play", color: "success", depends: ["stopped", "created", "exited"] },
  { name: "restart", icon: "mdi-restore", color: "warning", depends: ["running", "stopped", "created", "exited", "paused"] },
  { name: "stop", icon: "mdi-stop", color: "error", depends: ["running", "paused"] },
  { name: "pause", icon: "mdi-pause", color: "info", depends: ["running"] },
  { name: "unpause", icon: "mdi-play-outline", color: "success", depends: ["paused"] },
  { name: "kill", icon: "mdi-fire", color: "error", depends: ["all"] },
  { name: "remove", icon: "mdi-delete", color: "error", depends: ["all"] },
];

const filteredActions = computed(() => {
  // This is a placeholder. You should implement the actual filtering logic
  // based on the current state of the containers.
  return actions;
});
</script>

<style></style>
