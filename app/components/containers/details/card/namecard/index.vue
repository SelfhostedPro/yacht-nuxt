<template>
  <v-card>
    <v-toolbar>
      <!-- avatar title and status -->
      <template #prepend>
        <containers-actions
          variant="text"
          :container="container"
          :server="server"
        />
        <v-spacer v-if="!smAndDown" />
        <lazy-containers-logs
          @close="logsOpen = false"
          v-if="logsOpen"
          v-model="logsOpen"
          :server="server"
          :name="container.name"
        />
        <lazy-containers-terminal
          @close="terminalOpen = false"
          v-if="terminalOpen"
          v-model="terminalOpen"
          :server="server"
          :name="container.name"
        />
      </template>
      <template #append>
        <v-btn-group variant="text" v-if="!smAndDown">
          <v-tooltip
            v-for="button in toolbarButtons"
            :key="button.text"
            :text="button.text"
          >
            <template v-slot:activator="{ props: tooltip }">
              <v-btn
                class="my-1"
                size="default"
                :rounded="0"
                v-bind="tooltip"
                :icon="button.icon"
                :color="button.color"
                @click="button.click()"
              >
                <v-icon :icon="button.icon"
              /></v-btn>
            </template>
          </v-tooltip>
        </v-btn-group>
        <v-btn color="grey-lighten-5" v-else>
          <v-icon icon="mdi-dots-vertical" />
          <v-menu activator="parent">
            <v-card>
              <v-btn
                v-for="button in toolbarButtons.toReversed()"
                :key="button.text"
                block
                :rounded="0"
                :color="button.color"
                @click="button.click"
              >
                <v-icon :icon="button.icon" />
                {{ button.text }}
              </v-btn>
            </v-card>
          </v-menu>
        </v-btn>
      </template>
    </v-toolbar>
    <v-card-title>
      <v-toolbar-title
        :class="`align-center ${smAndDown ? 'd-flex flex-column' : ''}`"
      >
        <v-avatar
          :image="
            container.info.icon ||
            'https://cdn.vuetifyjs.com/images/cards/halcyon.png'
          "
        />
        <v-tooltip :text="container.status" location="bottom">
          <template v-slot:activator="{ props }">
            <v-avatar
              class="ml-1"
              v-bind="props"
              :color="container.status == 'running' ? 'primary' : 'red'"
              size="6"
            ></v-avatar>
          </template>
        </v-tooltip>
        {{ " " + container.name }}
      </v-toolbar-title>
    </v-card-title>
  </v-card>
</template>

<script lang="ts" setup>
import type { Container } from "~/types/containers/yachtContainers";
const { smAndDown } = useDisplay();
const logsOpen = ref(false);
const terminalOpen = ref(false);
interface Props {
  container: Container;
  server: string;
}
defineProps<Props>();

const toolbarButtons: {
  text: string;
  icon: string;
  click: () => void;
  color?: string;
}[] = [
  {
    text: "terminal",
    icon: "mdi-console",
    click: () => (terminalOpen.value = true),
  },
  {
    text: "logs",
    icon: "mdi-note-text-outline",
    click: () => (logsOpen.value = true),
  },
  {
    text: "help",
    icon: "mdi-help-circle-outline",
    color: "info",
    click: () => console.log("not implemented yet"),
  },
  {
    text: "edit",
    icon: "mdi-file-document-edit-outline",
    color: "warning",
    click: () => console.log("not implemented yet"),
  },
];
</script>

<style></style>
