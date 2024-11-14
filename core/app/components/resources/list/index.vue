<template>
  <common-list :resource="resource" :name="name" :loading="loading.includes(name)">
    <template #buttons>
      {{ name }}
      <Button :loading="loading.includes(name)" @click="refresh" variant="ghost">
        <RefreshCw class="w-4 h-4" />
      </Button>
    </template>
    <template #card="{
      server,
      resource,
    }: {
      server: string,
        resource: DataIteratorItem<unknown>,
      }">
      <resources-list-network-card v-if="name === 'networks'" :server="server"
        :resource="(resource.raw as NetworkInspectInfo)" />
      <resources-list-image-card v-if="name === 'images'" :server="server" :resource="(resource.raw as ImageInfo)" />
      <resources-list-volume-card v-if="name === 'volumes'" :server="server"
        :resource="(resource.raw as FixedVolumeInspectInfo)" />
    </template>
  </common-list>
</template>

<script setup lang="ts">
import {
  ResourcesListImageCard,
  ResourcesListNetworkCard,
  ResourcesListVolumeCard,
} from "#components";
import type { FixedVolumeInspectInfo } from "#docker/types/containers/fixedDockerode";
import type {
  NetworkInspectInfo,
  ImageInfo,
} from "dockerode";
import type { DataIteratorItem } from "#docker/types/common/vuetify";
import { useResourcesStore } from "#core/app/stores/resources";
import { RefreshCcw, RefreshCw } from 'lucide-vue-next';

interface Props {
  name: "networks" | "volumes" | "images";
}

const props = defineProps<Props>();
const resourcesStore = useResourcesStore();
const { loading, [props.name]: resource } = storeToRefs(resourcesStore);
const { refresh } = await resourcesStore.fetchResources(props.name);
</script>
