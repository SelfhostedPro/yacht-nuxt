<template>
  <v-alert
    :width="smAndDown ? '100%' : '30vw'"
    :type="level ? levelMap[level].color : 'info'"
    :title="title"
    :text="message"
    variant="elevated"
    border="bottom"
  >
    <template #prepend>
      <v-icon
        size="32"
        :icon="level ? levelMap[level].icon : 'mdi-information-outline'"
      />
    </template>
    <template v-if="title" #title
      ><p class="text-h6">{{ title }}</p></template
    >
    <template #text>{{ message }}</template>
    <template #close>
      <v-btn @click="$emit('closeToast')">x</v-btn>
    </template>
  </v-alert>
</template>

<script setup lang="ts">
import type { Notification, NotificationLevel } from "#imports";
defineEmits(["closeToast"]);
const { smAndDown } = useDisplay();

const { dedupe, level, message, timeout, title } = defineProps<Notification>();

const levelMap: {
  [level in NotificationLevel]: {
    color: "info" | "error" | "success" | "warning" | undefined;
    icon: string;
  };
} = {
  info: { color: "info", icon: "mdi-information" },
  debug: { color: "info", icon: "mdi-information-outline" },
  error: { color: "error", icon: "mdi-alert-outline" },
  fatal: { color: "error", icon: "mdi-alert-outline" },
  success: { color: "success", icon: "mdi-check-circle-outline" },
  warn: { color: "warning", icon: "mdi-alert-outline" },
};
</script>
