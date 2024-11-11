<template>
  <!-- :to="`/containers/${server}/${container.name}`" -->
  <v-hover v-slot="{ isHovering, props: props2 }" open-delay="100">
    <v-card
      v-auto-animate
      v-bind="props2"
      :class="`v-container-card overflow-visible mt-8 ${
        isHovering || selected ? 'on-hover' : ''
      }`"
      density="compact"
      :loading="loading.includes(container.id) ? 'primary' : false"
      :color="selected ? 'foreground' : 'surface'"
      flat
      :ripple="false"
      @click="$emit('selected')"
    >
      <v-sheet
        :class="`mx-auto v-container-sheet 
        ${isHovering ? 'on-hover' : ''}
        ${selected ? 'on-selected' : ''}`"
        :elevation="selected ? '8' : '3'"
        max-width="calc(100% - 24px)"
        color="primary"
        rounded="lg"
      >
        <!-- :max-width="selected ? '97%' : `calc(100% - 24px)`" -->

        <containers-list-card-base :container="container" :stats="stats" />
      </v-sheet>
      <v-card-actions
        class="py-0 mt-n2 v-card-actions--offset d-flex justify-space-between"
      >
        <v-btn variant="plain" icon @click.stop="showActions = !showActions">
          <v-icon :icon="showActions ? 'mdi-chevron-up' : 'mdi-chevron-down'" />
        </v-btn>
        <v-btn
          variant="plain"
          icon
          :to="`/containers/${server}/${container.name}`"
          @click.stop
          ><v-icon icon="mdi-information-outline"
        /></v-btn>
      </v-card-actions>
      <!-- Expansion Ref -->
      <v-expand-transition>
        <div v-show="showActions">
          <div class="pb-2 px-2 mx-2" @click.stop>
            <!-- <div @click.stop class="d-flex flex-row rounded-lg pa-2"> -->
            <lazy-containers-list-card-actions
              :container="container"
              :server="server"
            />
          </div>
          <!-- </div> -->
        </div>
      </v-expand-transition>
    </v-card>
  </v-hover>
</template>

<script lang="ts" setup>
import type {
  Container,
  ContainerStat,
} from "#core/types/containers/yachtContainers";
import { useContainersStore } from "#core/app/stores/containers";
// import type { SelectableItem } from "~~/types/common/vuetify";

// Loading State
const { loading } = storeToRefs(useContainersStore());
const showActions = ref(false);

interface Props {
  container: Container;
  stats?: ContainerStat;
  server: string;
  selected?: boolean;
}

defineEmits(["selected"]);

// Define Props
const { container, stats, server, selected } = defineProps<Props>();

// const infoComponents = [
//   {
//     name: "Actions",
//     icon: ["mdi-chevron-up", "mdi-chevron-down"],
//     component: actions,
//   },
//   {
//     name: "Ports",
//     icon: ["mdi-lan-pending", "mdi-lan-connect"],
//     component: markRaw(LazyContainersListCardPorts),
//   },
//   {
//     name: "Mounts",
//     icon: ["mdi-file-tree", "mdi-file-tree-outline"],
//     component: markRaw(LazyContainersListCardMounts),
//   },
//   {
//     name: "Raw",
//     icon: ["mdi-code-braces-box", "mdi-code-braces"],
//     component: raw,
//   },
// ];
</script>

<style scoped>
.v-container-sheet {
  transition: all 0.2s ease-in-out;
  top: -1rem;
  position: relative;
}
.v-container-sheet:has(.on-hover) {
  opacity: 1;
  scale: 1.03;
}
.v-container-sheet:has(.on-selected) {
  opacity: 1;
  scale: 1.03;
}
.v-container-card {
  transition: all 0.2s ease-in;
  opacity: 1;
}
.v-container-card:has(.on-hover) {
  scale: 1.02;
}
.v-container-card:has(.on-selected) {
  scale: 1.02;
}

.v-card--reveal {
  bottom: 0;
  opacity: 1 !important;
  position: absolute;
  width: 100%;
}
</style>

<!-- <template>
    <v-card class="pa-2 justify-start" density="compact">
      <v-row dense no-gutters class="align-start">
        <v-col>
          <containers-card-base :container="container" />
          <v-row>
            
          </v-row>
          <transition
            name="expand"
            @before-enter="beforeEnter"
            @enter="enter"
            @before-leave="beforeLeave"
            @leave="leave"
          >
            <div v-if="reveal.length > 0">
              <component v-for="(revealItem, i) in reveal" :key="i"
                         :is="revealItem"
                         v-bind:mounts="container.mounts && container.mounts[0] ? container.mounts : []"
                         v-bind:ports="container.ports && container.ports[0] ? container.ports : []" />
            </div>
          </transition>
        </v-col>
      </v-row>
    </v-card>
  </template> 
  
  <script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { ContainersCardMounts, ContainersCardPorts } from '#components';
  import type { Container } from '~~/types/containers/yachtContainers';
  
  const props = defineProps<{ container: Container }>();
  const reveal = ref([] as Array<typeof ContainersCardMounts | typeof ContainersCardPorts>);
  
  function beforeEnter(el) {
    el.style.height = '0';
  }
  
  function enter(el, done) {
    el.style.height = `${el.scrollHeight}px`;
    el.style.overflow = 'hidden';
    done();
  }
  
  function beforeLeave(el) {
    el.style.height = `${el.scrollHeight}px`;
    el.style.overflow = 'hidden';
  }
  
  function leave(el, done) {
    el.style.height = '0';
    done();
  }
  
  // Other methods...
  </script>
  
  <style>
  .expand-enter-active, .expand-leave-active {
    transition: height 0.3s ease;
  }
  .expand-enter-from, .expand-leave-to {
    height: 0;
  }
  </style>
  -->
