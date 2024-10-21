<template>
  <v-hover open-delay="100" v-slot="{ isHovering, props }">
    <v-card v-bind="props" @click="$emit('selected')" :class="cardClasses(isHovering ?? false)" density="compact"
      :loading="loading.includes(container.id) ? 'primary' : false" :color="selected ? 'foreground' : 'surface'" flat
      :ripple="false" v-auto-animate>
      <v-sheet :class="sheetClasses(isHovering ?? false)" :elevation="selected ? '8' : '3'"
        max-width="calc(100% - 24px)" max-height="calc(100% - 24px)" color="primary" rounded="lg">
        <containers-list-card-base :container="container" :stats="stats" />
      </v-sheet>
      <v-card-actions class="py-0 v-card-actions--offset d-flex justify-space-between">
        <v-btn variant="plain" icon @click.stop="showActions = !showActions">
          <v-icon :icon="showActions ? 'mdi-chevron-up' : 'mdi-chevron-down'" />
        </v-btn>
        <lazy-containers-list-card-actions :container="container" :server="server" />
        <v-btn variant="plain" icon @click.stop :to="`/containers/${server}/${container.name}`">
          <v-icon icon="mdi-information-outline" />
        </v-btn>
      </v-card-actions>
      <v-expand-transition>
        <div v-show="showActions">
          <div @click.stop class="pb-2 px-2 mx-2 v-card-actions--offset">
            <lazy-containers-list-card-mounts :mounts="container.mounts || []" />
            <lazy-containers-list-card-ports :ports="container.ports || []" :labels="container.labels" />
            <lazy-containers-list-card-raw :container="container" />
          </div>
        </div>
      </v-expand-transition>
    </v-card>
  </v-hover>
</template>

<script lang="ts" setup>
import type {
  Container,
  ContainerStat,
} from "~~/types/containers/yachtContainers";

const { loading } = storeToRefs(useContainersStore());
const showActions = ref(false);

interface Props {
  container: Container;
  stats?: ContainerStat;
  server: string;
  selected?: boolean;
}

defineEmits(["selected"]);
const props = defineProps<Props>();

const cardClasses = (isHovering: boolean) => [
  'v-container-card',
  'overflow-visible',
  'mt-2',
  { 'on-hover': isHovering || props.selected }
];

const sheetClasses = (isHovering: boolean) => [
  'mx-auto',
  'v-container-sheet',
  { 'on-hover': isHovering },
  { 'on-selected': props.selected }
];
</script>

<style scoped>
.v-container-sheet {
  transition: all 0.2s ease-in-out;
  top: -1rem;
  position: relative;
}

.v-container-sheet:has(.on-hover),
.v-container-sheet:has(.on-selected) {
  opacity: 1;
  scale: 1.03;
}

.v-container-card {
  transition: all 0.2s ease-in;
  max-height: calc(100% - 24px);
  opacity: 1;
}

.v-container-card:has(.on-hover),
.v-container-card:has(.on-selected) {
  scale: 1.02;
}

.v-card-actions--offset {
  position: relative;
  top: -1rem;
}

.v-card--reveal {
  bottom: 0;
  opacity: 1 !important;
  position: absolute;
  width: 100%;
}
</style>
