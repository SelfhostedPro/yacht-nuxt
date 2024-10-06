<template>
  <common-list
    :resource="resource"
    :name="name"
    :loading="loading.includes(name)"
  >
    <template #buttons>
      {{ name }}
      <v-btn icon :loading="loading.includes(name)" @click="refresh()">
        <v-icon>mdi-refresh</v-icon>
      </v-btn>
    </template>
    <template
      #card="{
        server,
        resource,
      }: {
        server: string,
        resource: DataIteratorItem<unknown>,
      }"
    >
      <resources-list-network-card
        v-if="name === 'networks'"
        :server="server"
        :resource="(resource.raw as NetworkInspectInfo)"
      />
      <resources-list-image-card
        v-if="name === 'images'"
        :server="server"
        :resource="(resource.raw as ImageInfo)"
      />
      <resources-list-volume-card
        v-if="name === 'volumes'"
        :server="server"
        :resource="(resource.raw as FixedVolumeInspectInfo)"
      />
    </template>
  </common-list>
</template>
<script setup lang="ts">
import {
  ResourcesListImageCard,
  ResourcesListNetworkCard,
  ResourcesListVolumeCard,
} from "#components";
import type { FixedVolumeInspectInfo } from "~/types/containers/fixedDockerode";
import type {
  NetworkInspectInfo,
  ImageInfo,
  VolumeInspectInfo,
} from "dockerode";
import type { DataIteratorItem } from "~/types/common/vuetify";
interface Props {
  name: "networks" | "volumes" | "images";
}
const props = defineProps<Props>();
const resourcesStore = useResourcesStore();
const { loading, [props.name]: resource } = storeToRefs(resourcesStore);
const { refresh } = await resourcesStore.fetchResources(props.name);
</script>
