<template>
  <!-- :to="`/containers/${server}/${container.name}`" -->
  <v-card
    @click="$emit('selected')"
    class="mt-8 overflow-visible"
    density="compact"
    style="transition: height 0.3s ease-in-out"
    :loading="loading.includes(container.id) ? 'primary' : false"
    :color="selected ? 'secondary' : 'surface'"
    v-auto-animate
  >
    <v-sheet
      class="v-sheet--offset mx-auto"
      color="primary"
      elevation="12"
      max-width="calc(100% - 24px)"
      rounded="lg"
    >
      <containers-list-card-base :container="container" :stats="stats" />
    </v-sheet>
    <!-- <v-row dense no-gutters class="align-center justify-start v-sheet--offset">
        <v-col class="d-flex justify-space-between"> -->
    <!-- Expansion Buttons -->
    <v-card-actions class="pt-0 mt-n2 v-card-actions--offset">
      <v-btn-toggle
        @click.stop
        v-model="reveal"
        :rounded="false"
        multiple
        variant="text"
        color="primary"
      >
        <v-tooltip
          v-for="component in infoComponents"
          :key="component.name"
          :text="component.name"
          location="bottom"
        >
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              :active="reveal.includes(component.component)"
              :icon="
                reveal.includes(component.component)
                  ? component.icon[0]
                  : component.icon[1]
              "
              :value="component.component"
            />
          </template>
        </v-tooltip>
      </v-btn-toggle>
      <v-btn
        variant="plain"
        icon
        @click.stop
        :to="`/containers/${server}/${container.name}`"
        ><v-icon icon="mdi-information-outline"
      /></v-btn>
    </v-card-actions>
    <!-- Expansion Ref -->
    <ul v-auto-animate>
      <!-- Dynamic Components -->
      <component
        :is="revealItem"
        v-for="(revealItem, i) in reveal"
        :key="i"
        :size="reveal.includes(actions) ? 'x-small' : null"
        :mounts="
          container.mounts && container.mounts[0] ? container.mounts : []
        "
        :ports="container.ports && container.ports[0] ? container.ports : []"
        :labels="container.labels"
        :container="
          reveal.includes(raw) || reveal.includes(actions) ? container : null
        "
        :loading="reveal.includes(actions) && loading.includes(container.id)"
        :server="reveal.includes(actions) ? server : null"
      />
    </ul>
  </v-card>
</template>

<script lang="ts" setup>
import {
  LazyContainersListCardActions,
  LazyContainersListCardMounts,
  LazyContainersListCardPorts,
  LazyContainersListCardRaw,
} from "#components";
import type {
  Container,
  ContainerStat,
} from "~/types/containers/yachtContainers";
import type { SelectableItem } from "~/types/common/vuetify";
type DynamicComponent =
  | typeof LazyContainersListCardActions
  | typeof LazyContainersListCardMounts
  | typeof LazyContainersListCardPorts
  | typeof LazyContainersListCardRaw;

// Loading State
const { loading } = storeToRefs(useContainersStore());

interface Props {
  container: Container;
  stats?: ContainerStat;
  server: string;
  selected?: boolean;
}

defineEmits(["selected"]);

// Define Props
const props = defineProps<Props>();
const reveal = useState(
  `reveal-${props.container.shortId}`,
  () => [] as DynamicComponent[]
);

const raw = markRaw(LazyContainersListCardRaw);
const actions = markRaw(LazyContainersListCardActions);
const infoComponents = [
  {
    name: "Actions",
    icon: ["mdi-chevron-up", "mdi-chevron-down"],
    component: actions,
  },
  {
    name: "Ports",
    icon: ["mdi-lan-pending", "mdi-lan-connect"],
    component: markRaw(LazyContainersListCardPorts),
  },
  {
    name: "Mounts",
    icon: ["mdi-file-tree", "mdi-file-tree-outline"],
    component: markRaw(LazyContainersListCardMounts),
  },
  {
    name: "Raw",
    icon: ["mdi-code-braces-box", "mdi-code-braces"],
    component: raw,
  },
];
</script>

<style>
.v-sheet--offset {
  top: -1rem;
  position: relative;
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
    import type { Container } from '~/types/containers/yachtContainers';
    
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
~/shared/containers/yachtContainers~/shared/common/vuetify
