<template>
  <div class="flex flex-col items-center overflow-x-auto text-no-wrap px-5">
    <ul>
      <li
        v-for="[property, value], i in Object.entries(container).filter(([k, v]) => (Array.isArray(v) && v.length > 0) || (typeof v === 'string') || (!Array.isArray(v) && Object.entries(v).length > 0))"
        :key="i"
      >
        <div v-if="(typeof value === 'string')" class="font-bold">
          {{ property }}
        </div>
        <div v-else-if="(Array.isArray(value) && value.length > 0)" class="pb-1 bg-gray-100">
          <button @click="toggle(property)" class="w-full text-left">
            {{ property }}
          </button>
          <div v-if="isOpen(property)" class="my-3 mx-2">
            <div v-for="subItem, _i in value.filter((e) => e).values()" :key="_i" class="p-3 border rounded shadow">
              <pre class="text-sm">{{ subItem }}</pre>
            </div>
          </div>
        </div>
        <div v-else-if="(!Array.isArray(value) && Object.keys(value).length > 0)" class="pb-1 bg-gray-100">
          <button @click="toggle(property)" class="w-full text-left">
            {{ property }}
          </button>
          <ul v-if="isOpen(property)">
            <li v-for="[subProperty, subItem], _i in Object.entries(value)" :key="_i" class="flex justify-between">
              <span class="font-semibold">{{ subProperty }}</span>
              <span class="overflow-x-auto">{{ subItem }}</span>
            </li>
          </ul>
        </div>
        <div v-if="(typeof value === 'string')" class="text-gray-600">
          {{ value }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { Container } from '#docker/types/containers/yachtContainers';

const open = ref([] as string[]);

defineProps<{ container: Container }>();

function toggle(item: string) {
  if (open.value.includes(item)) {
    open.value = open.value.filter(i => i !== item);
  } else {
    open.value.push(item);
  }
}

function isOpen(item: string) {
  return open.value.includes(item);
}
</script>

<style scoped>
/* Add any additional scoped styles if necessary */
</style>
