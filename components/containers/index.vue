<template>
  <v-container fluid class="px-0">
    <common-list :resource="servers" name="containers" :loading="loading.includes('containers')">
      <template #bulk-buttons="{ selectedItems, server }">
        <v-btn-group>
          <v-tooltip v-for="action in actions" :key="action.name" :text="action.name" location="bottom">
            <template #activator="{ props: props }">
              <v-btn v-bind="props" :color="action.color" class="my-1"
                @click.prevent="handleBulkAction(server, selectedItems, action.name)">
                <v-icon :icon="action.icon" />
              </v-btn>
            </template>
          </v-tooltip>
        </v-btn-group>
      </template>
      <template #buttons>
        <v-btn icon color="primary" @click="createDialog = true">
          <v-icon icon="mdi-plus" />
        </v-btn>
        <containers-create v-if="createDialog" v-model:open="createDialog" />
        <v-btn icon :loading="loading.includes('containers')" @click="refresh()">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
      </template>
      <template #card="{ server, resource, toggleSelect, isSelected }">
        <lazy-containers-list-card :container="(resource.raw as Container)" :server="server"
          :stats="stats[resource.raw.name] ? stats[resource.raw.name] : undefined" :selected="isSelected(resource)"
          @selected="toggleSelect(resource)" />
      </template>
    </common-list>
  </v-container>
</template>

<script lang="ts" setup>
import type { Container } from "~/types/containers/yachtContainers"
const containersStore = useContainersStore()
const { servers, loading, stats } = storeToRefs(containersStore)
const notifications = notificationsConnected()
const createDialog = ref(false)

const refresh = async () => {
  await until(notifications).toBe(true)
  await useAsyncData('containerList', () => containersStore.fetchContainers(), {
    default() {
      return {}
    },
  })
  await useAsyncData('containerStats', () => containersStore.fetchContainerStats(), {
    default() {
      return {}
    },
  })
}

const handleBulkAction = async (server: string, items: string[], action: string) => {
  // if (action === "remove" && removeDialog.value === false) {
  //   removeDialog.value = true
  //   return
  // } else {
  //   emit("startLoading")
  //   await containers.fetchContainerAction(props.server, props.container.id, action)
  //   emit("stopLoading")
  //   return
  // }
}

const actions = [
  {
    name: "start",
    icon: "mdi-play",
    color: "success",
    depends: ["stopped", "created", "exited"]
  },
  {
    name: "restart",
    icon: "mdi-restore",
    color: "warning",
    depends: ["running", "stopped", "created", "exited", "paused"]
  },
  {
    name: "stop",
    icon: "mdi-stop",
    color: "error",
    depends: ["running", "paused"]
  },
  {
    name: "pause",
    icon: "mdi-pause",
    color: "info",
    depends: ["running"]
  },
  {
    name: "unpause",
    icon: "mdi-play-outline",
    color: "success",
    depends: ["paused"]
  },
  {
    name: "kill",
    icon: "mdi-fire",
    color: "error",
    depends: ["all"]
  },
  {
    name: "remove",
    icon: "mdi-delete",
    color: "error",
    depends: ["all"]
  }
]

onMounted(() => {
  refresh()
})
</script>

<style></style>