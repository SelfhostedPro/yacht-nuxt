<template>
  <v-card class="pa-2 justify-start" density="compact" style="transition: height 0.3s ease-in-out;">
    <v-row dense no-gutters class="align-start">
      <v-col>
        <containers-card-base :container="container" />
        <v-row>
          <v-col>
            <v-btn :icon="reveal.includes(raw) ? 'mdi-code-braces-box' : 'mdi-code-braces'" variant="text" color="primary"
              v-on:click.prevent="handleRevealButton(raw)" />
            <v-btn v-if="container.mounts && container.mounts[0]"
              :icon="reveal.includes(mounts) ? 'mdi-information' : 'mdi-information-outline'" variant="text"
              color="primary" v-on:click.prevent="handleRevealButton(mounts)" />
            <v-btn v-if="container.ports && container.ports[0]"
              :icon="reveal.includes(ports) ? 'mdi-information-off' : 'mdi-information'" variant="text" color="primary"
              v-on:click.prevent="handleRevealButton(ports)" />
          </v-col>
        </v-row>
        <ul ref="parent">
          <component @onEnter="useOnChildEnter($this)" v-for="revealItem, i in reveal" :key="i" :is="revealItem"
            v-bind:mounts="container.mounts && container.mounts[0] ? container.mounts : []"
            v-bind:ports="container.ports && container.ports[0] ? container.ports : []"
            v-bind:container="reveal.includes(raw) ? container : null" />
        </ul>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts" setup>
import { LazyContainersCardMounts, LazyContainersCardPorts, LazyContainersCardRaw } from '#components'
import type { Container } from '~/types/containers/yachtContainers';

// Define Components
const mounts = markRaw(LazyContainersCardMounts)
const ports = markRaw(LazyContainersCardPorts)
const raw = markRaw(LazyContainersCardRaw)

const [parent] = useAutoAnimate({ easing: 'ease-in-out' })

type DynamicComponent = typeof LazyContainersCardMounts | typeof LazyContainersCardPorts | typeof LazyContainersCardRaw

const props = defineProps<{ container: Container }>()
const reveal = useState(`reveal-${props.container.shortId}`, () => [] as DynamicComponent[])


const handleRevealButton = (component: DynamicComponent) => {
  const idx = reveal.value.indexOf(component)
  idx > -1 ? reveal.value.splice(idx, 1) : reveal.value.push(component)
}

</script>

<style>
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