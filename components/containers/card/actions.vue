<template>
  <!-- <v-card-item>
    <v-row>
      <v-col cols="12">
        <v-btn-group v-auto-animate divided class="d-flex justify-center">
          <v-tooltip v-for="action in actions" :key="action.name" :text="action.name" location="bottom">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" v-if="action.depends.includes(container.status) || action.depends.includes('all')"
                v-on:click.prevent="handleAction(action.name)" :size="mdAndDown ? 'small' : 'default'"
                :color="action.color" class="my-1">
                <v-icon :icon="action.icon" />
              </v-btn>
            </template>
          </v-tooltip>
        </v-btn-group>
      </v-col>
    </v-row>
    <v-dialog v-model="removeDialog">
      <v-card width="40vw" class="mx-auto">
        <v-row no-gutters>
          <v-col>
            <v-card-title class="text-no-wrap mt-3 ml-5">remove <b class="text-error">{{ container.name }}</b>?
            </v-card-title>
          </v-col>
          <v-col cols="1">
            <v-btn :rounded="0" variant="plain" icon><v-icon icon="mdi-window-close" /></v-btn>
          </v-col>
        </v-row>
        <v-card-text>
          Are you sure you want to permanently remove
          <b class="text-error">{{ container.name }}</b>?<br />
          All non-peristent data will be unrecoverable.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn v-on:click.prevent="removeDialog = false">Cancel</v-btn>
          <v-btn color="error" v-on:click.prevent="removeDialog = false">Remove</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card-item> -->
</template>

<script lang="ts" setup>
import type { Container } from '~/types/containers/yachtContainers';
const containers = useContainersStore()
// const { mdAndDown } = useDisplay()
const props = defineProps<{ container: Container, server: string }>()
const emit = defineEmits(["startLoading", "stopLoading"])
const removeDialog: Ref<boolean> = ref(false)

const [parent] = useAutoAnimate()

const handleAction = async (action: string) => {
  if (action === "remove") {
    removeDialog.value = true
    return
  } else {
    emit("startLoading")
    await containers.fetchContainerAction(props.server, props.container.id, action)
    emit("stopLoading")
    return
  }
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
</script>

<style></style>