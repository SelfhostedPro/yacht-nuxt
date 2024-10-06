<template>
  <v-btn-group
    class="d-flex flex-row align-center justify-space-between"
    divided
  >
    <v-btn
      v-for="action in actions.filter(
        (_action) =>
          _action.depends.includes(container.status) ||
          _action.depends.includes('all')
      )"
      class="flex-grow-1 py-2"
      :key="action.name"
      :disabled="loading || false"
      :color="action.color"
      @click.prevent="handleAction(action.name)"
      :icon="action.icon"
    />
  </v-btn-group>
  <v-dialog v-model="removeDialog">
    <v-card width="40vw" class="mx-auto">
      <v-row no-gutters>
        <v-col>
          <v-card-title class="text-no-wrap mt-3 ml-5">
            remove <b class="text-error">{{ container.name }}</b
            >?
          </v-card-title>
        </v-col>
        <v-col cols="1">
          <v-btn
            :rounded="0"
            variant="plain"
            icon
            @click="removeDialog = false"
          >
            <v-icon icon="mdi-window-close" />
          </v-btn>
        </v-col>
      </v-row>
      <v-card-text>
        Are you sure you want to permanently remove
        <b class="text-error">{{ container.name }}</b
        >?<br />
        All non-peristent data will be unrecoverable.
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn @click.prevent="removeDialog = false"> Cancel </v-btn>
        <v-btn
          color="error"
          @click.prevent="
            handleAction('remove');
            removeDialog = false;
          "
        >
          Remove
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import type { Container } from "~/types/containers/yachtContainers";
const containers = useContainersStore();
interface Props {
  container: Container;
  server: string;
  variant?: "flat" | "text" | "elevated" | "tonal" | "outlined" | "plain";
  size?: string;
  loading?: boolean;
}
const props = defineProps<Props>();
const emit = defineEmits(["startLoading", "stopLoading"]);
const removeDialog: Ref<boolean> = ref(false);

const handleAction = async (action: string) => {
  if (action === "remove" && removeDialog.value === false) {
    removeDialog.value = true;
    return;
  } else {
    emit("startLoading");
    await containers.fetchContainerAction(
      props.server,
      props.container.name,
      action
    );
    emit("stopLoading");
    return;
  }
};

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

<style></style>
~/shared/containers/yachtContainers
