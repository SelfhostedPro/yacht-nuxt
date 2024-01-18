<template>
  <!-- <v-card-item class="d-flex flex-column items-center overflow-x-auto text-no-wrap px-5">
    <v-list v-model="open">
      <v-list-item
        v-for="[property, value], i in Object.entries(container).filter(([k, v]) => (Array.isArray(v) && v.length > 0) || (typeof v === 'string') || (!Array.isArray(v) && Object.entries(v).length > 0))">
        <v-list-item-title v-if="(typeof value === 'string')">{{ property }}</v-list-item-title>
        <v-list-group class='pb-1 bg-surface-lighten-1' v-else-if="(Array.isArray(value) && value.length > 0)"
          :value="property">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props">
              {{ property }}
            </v-list-item>
          </template>
          <v-card class="my-3 mx-2" v-for="subItem, i in value.filter((e) => e).values()" :key="i">
            <v-card-text class="overflow-x-auto">
              <pre class="text-sm">{{ subItem }}</pre>
            </v-card-text>
          </v-card>
        </v-list-group>
        <v-list-group class='pb-1 bg-surface-lighten-1'
          v-else-if="(!Array.isArray(value) && Object.keys(value).length > 0)" :value="property">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props">
              {{ property }}
            </v-list-item>
          </template>
          <v-list-item v-for="[subProperty, subItem], i in Object.entries(value)" :key="i">
            <v-list-item-title>{{ subProperty }}</v-list-item-title>
            <v-list-item-subtitle class="overflow-x-auto">{{ subItem }}</v-list-item-subtitle>
          </v-list-item>
        </v-list-group>
        <v-list-item-subtitle v-if="(typeof value === 'string')">{{ value }}</v-list-item-subtitle>
      </v-list-item>
    </v-list>
    <pre>
      {{ formatContainer(container) }}
    </pre>
  </v-card-item> -->
</template>

<script lang="ts" setup>
import type { Container } from '~/types/containers/yachtContainers';
const open = ref([] as string[])
const props = defineProps<{ container: Container }>()

const formatContainer = (container: Container) => {
  return JSON.stringify(container, null, 2)
}
</script>

<style></style>