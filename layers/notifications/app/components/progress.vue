<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-card
    :width="smAndDown ? '100%' : '30vw'"
    :title="title"
    style="transition: all 0.2"
    variant="elevated"
    border="bottom"
  >
    <template v-if="title" #title
      ><p class="text-h6">{{ title }}</p></template
    >
    <v-expand-transition group>
      <v-card-item v-for="(item, i) in items" :key="i">
        <v-card-subtitle class="d-flex justify-space-between">
          <p>{{ item.status }}</p>
          <p>
            {{
              item.current && item.total
                ? bytes
                  ? `${formatBytes(item.current)} / ${formatBytes(item.total)}`
                  : `${item.current} / ${item.total}`
                : null
            }}
          </p>
        </v-card-subtitle>
        <v-progress-linear
          :model-value="
            ((item.current ||
              // If waiting or pulling fs layer, bar should be empty if there's no current/total values.
              (item.status === 'Waiting' || item.status === 'Pulling fs layer'
                ? 0
                : 100)) /
              (item.total || 100)) *
            100
          "
        />
      </v-card-item>
    </v-expand-transition>
  </v-card>
</template>

<script setup lang="ts">
import { useProgressStore } from '#notifications/app/stores/progressStore';
import type { ProgressItems } from '#notifications/types/progress';
const { smAndDown } = useDisplay();
defineEmits(["closeToast"]);

interface Props {
  id: string;
  testTitle?: string;
  testProgress?: ProgressItems;
}

const progressStore = useProgressStore();
const { progress } = storeToRefs(progressStore);
const { id, testProgress, testTitle } = defineProps<Props>();

const { title, items, bytes } = progress.value[id] || {
  title: testTitle,
  items: testProgress,
  bytes: false,
};
</script>