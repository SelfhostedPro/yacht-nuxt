<template>
  <div
    class="overflow-visible mt-8 transition-all duration-200 ease-in-out"
    :class="{ 'scale-105': selected }"
    @click="$emit('selected')"
  >
    <div
      class="mx-auto bg-primary rounded-lg transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg"
      style="max-width: calc(100% - 24px);"
    >
      <containers-list-card-base :container="container" :stats="stats" />
    </div>
    <div class="flex justify-between py-2 mt-2">
      <Button
        class="text-gray-500 hover:text-gray-700"
        @click.stop="showActions = !showActions"
      >
        <span :class="showActions ? 'rotate-180' : ''">
          <i class="icon-chevron-down"></i>
        </span>
      </Button>
      <Button
        class="text-gray-500 hover:text-gray-700"
        :to="`/containers/${server}/${container.name}`"
        @click.stop
      >
        <i class="icon-information-outline"></i>
      </Button>
    </div>
    <transition name="expand">
      <div v-show="showActions" class="pb-2 px-2 mx-2" @click.stop>
        <lazy-containers-list-card-actions
          :container="container"
          :server="server"
        />
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { Container, ContainerStat } from "#docker/types/containers/yachtContainers";
import { useContainersStore } from "#core/app/stores/containers";

const { loading } = storeToRefs(useContainersStore());
const showActions = ref(false);

interface Props {
  container: Container;
  stats?: ContainerStat;
  server: string;
  selected?: boolean;
}

defineEmits(["selected"]);
const { container, stats, server, selected } = defineProps<Props>();
</script>

<style scoped>
.icon-chevron-down {
  transition: transform 0.2s ease-in-out;
}
.icon-chevron-down.rotate-180 {
  transform: rotate(180deg);
}
</style>
