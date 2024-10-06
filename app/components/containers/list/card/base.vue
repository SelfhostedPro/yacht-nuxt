<template>
  <v-card-item class="px-2" density="compact">
    <template #prepend>
      <containers-list-card-stats
        v-if="container.status === 'running' && stats"
        :stats="stats"
      >
        <template #default>
          <v-avatar
            :image="
              container.info.icon
                ? container.info.icon
                : 'https://cdn.vuetifyjs.com/images/cards/halcyon.png'
            "
          />
        </template>
      </containers-list-card-stats>
      <v-avatar
        v-else
        :image="
          container.info.icon
            ? container.info.icon
            : 'https://cdn.vuetifyjs.com/images/cards/halcyon.png'
        "
      />
    </template>
    <v-card-title>
      <v-tooltip :text="container.state" location="bottom">
        <template #activator="{ props }">
          <v-avatar
            class="ml-1"
            v-bind="props"
            :color="container.status == 'running' ? 'primary' : 'red'"
            size="6"
          />
        </template>
      </v-tooltip>
      {{ container.name }}
    </v-card-title>
    <v-card-subtitle>{{ "image: " + container.image }}</v-card-subtitle>
    <v-card-subtitle>{{ "id: " + container.shortId }}</v-card-subtitle>
  </v-card-item>
</template>

<script lang="ts" setup>
import type {
  Container,
  ContainerStat,
} from "~/types/containers/yachtContainers";
interface Props {
  container: Container;
  stats?: ContainerStat;
}
defineProps<Props>();
</script>
~/shared/containers/yachtContainers
